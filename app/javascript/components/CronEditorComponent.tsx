import React from 'react';
import axios from 'axios';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { configureAxios } from './AjaxUtils';
import { setAsyncState } from './ReactUtils';
import HelpIcon from './HelpIcon';
import SelectBoxComponent from './SelectBoxComponent';

const selectionMatrix = {'minutely': [true, true, true, true, true, false, false, false, false, false],
                         'hourly':   [false, true, true, true, true, true, false, false, false, false],
                         'daily':    [false, false, true, true, true, true, true, false, false, false],
                         'weekly':   [false, false, true, true, false, true, true, false, false, true],
                         'monthly':  [false, false, false, true, true, true, true, true, false, false],
                         'yearly':   [false, false, false, false, true, true, true, true, true, false],
                         'custom':   [false, false, false, false, false, false, false, false, false, false]};

const monthList = [{val: 1, display: I18n.t('jobs.months.january')}, {val: 2, display: I18n.t('jobs.months.february')},
                   {val: 3, display: I18n.t('jobs.months.march')}, {val: 4, display: I18n.t('jobs.months.april')},
                   {val: 5, display: I18n.t('jobs.months.may')}, {val: 6, display: I18n.t('jobs.months.june')},
                   {val: 7, display: I18n.t('jobs.months.july')}, {val: 8, display: I18n.t('jobs.months.august')},
                   {val: 9, display: I18n.t('jobs.months.september')}, {val: 10, display: I18n.t('jobs.months.october')},
                   {val: 11, display: I18n.t('jobs.months.november')}, {val: 12, display: I18n.t('jobs.months.december')}]

const dowList = [{val: 0, display: I18n.t('jobs.days.sunday')}, {val: 1, display: I18n.t('jobs.days.monday')}, {val: 2, display: I18n.t('jobs.days.tuesday')},
                 {val: 3, display: I18n.t('jobs.days.wednesday')}, {val: 4, display: I18n.t('jobs.days.thursday')}, {val: 5, display: I18n.t('jobs.days.friday')},
                 {val: 6, display: I18n.t('jobs.days.saturday')}]

const minutesList = new Array(60).fill(null).map((x,i) => {return {val: i, display: i}})
const hoursList = new Array(24).fill(null).map((x,i) => {return {val: i, display: i}})
const domList = new Array(31).fill(null).map((x,i) => {return {val: i + 1, display: i + 1}})

export default class CronEditorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cron: props.cron,
      timezone: props.timezone,
      description: null,
      selectedSchedule: 'custom',
      minuteDisabled: false,
      hourDisabled: false,
      domDisabled: false,
      monthDisabled: false,
      dowDisabled: false,
      minutesAsSelect: false,
      hoursAsSelect: false,
      dowAsSelect: false,
      domAsSelect: false,
      monthAsSelect: false,
      minutesVal: null,
      hoursVal: null,
      domVal: null,
      monthsVal: null,
      dowVal: null,
      onChange: props.onChange
    };
  }

  componentDidMount() {
    this.setSelectedScheduleFromCron();
  }

  /*
  This will get called when the timezone changes. It allows us to tailor the schedule for the selected TZ
  */
  componentDidUpdate(prevProps, prevState)
  {
    if(prevProps.timezone != this.props.timezone)
    {
      setAsyncState(this, {timezone: this.props.timezone})
      .then(() => {
        this.fetchEnglishCron();
      });
    }
  }

  /*
  I couldn't find a js library that could do this, so I delegate it to the server. Rails has a gem that can take a cron
  expression and send back a verbal translation of it, and it's a pretty quick round-trip.
  */
  fetchEnglishCron = () => {
    const { cron, timezone } = this.state;
    configureAxios();
    axios.get(`/parse_cron`, {
      params: {
        cron: cron,
        timezone: timezone
      }
    })
    .then((response) => {
      let cronEnglish = response.data.description;
      let description = I18n.t('jobs.invalid_cron_expression', {cron: cron});
      if(cronEnglish != '')
      {
        description = I18n.t('jobs.schedule_description', {description: cronEnglish.toLowerCase(), timezone: timezone})
      }
      this.setState({description: description});
    });
  }

  /*
  Given a cron string, try and see if it fits one of our predefined schedules. If not, select
  the custom schedule.
  */
  setSelectedScheduleFromCron = () => {
    const { cron } = this.state;

    const components = cron.split(' ');
    const minutes = components[0];
    const hours = components[1];
    const dom = components[2];
    const month = components[3];
    const dow = components[4];

    setAsyncState(this, {minutesVal: minutes, hoursVal: hours, domVal: dom, monthsVal: month, dowVal: dow})
    .then(() => {
      const number = /^\d+$/;

      // Start off custom and see if we match one of the predefined schedules
      this.handleScheduleChange('custom', true);

      // Start with the simplest. If everything is '*' then it's a minutely job
      if(minutes === '*' && hours === '*' && dom === '*' && month === '*' && dow === '*')
      {
        this.handleScheduleChange('minutely', true);
      }

      // If we have single numbers in minute and hour slot, then we're hourly
      if(minutes.match(number) && hours === '*' && dom === '*' && month === '*' && dow === '*')
      {
        this.handleScheduleChange('hourly', true);
      }

      // If we have */60 in the minute slot, then we're hourly
      if(minutes === '*/60' && hours === '*' && dom === '*' && month === '*' && dow === '*')
      {
        this.handleScheduleChange('hourly', true);
      }

      if(minutes.match(number) && hours.match(number) && dom === '*' && month === '*' && dow === '*')
      {
        this.handleScheduleChange('daily', true);
      }

      if(minutes.match(number) && hours.match(number) && dom === '*' && month === '*' && dow.match(number)) {
        this.handleScheduleChange('weekly', true);
      }

      if(minutes.match(number) && hours.match(number) && dom.match(number) && month === '*' && dow === '*')
      {
        this.handleScheduleChange('monthly', true);
      }

      if(minutes.match(number) && hours.match(number) && dom.match(number) && month.match(number) && dow === '*')
      {
        this.handleScheduleChange('yearly', true);
      }
    });
  }

  /*
  Take all of the configured inputs and form a coherent cron string that can be sent back to the server
  */
  computeCronValue = (minutesVal, hoursVal, domVal, monthsVal, dowVal) => {
    const { onChange } = this.state;

    let cronArray = [];

    cronArray.push(minutesVal);
    cronArray.push(hoursVal);
    cronArray.push(domVal);
    cronArray.push(monthsVal);
    cronArray.push(dowVal);

    let cron = cronArray.join(' ');
    console.log('Cron = ' + cron);

    setAsyncState(this, { cron: cron })
    .then(() => {
      this.fetchEnglishCron();
      onChange(this.state.cron);
    });
  }

  /*
  When a new predefined schedule or 'custom' is selected, adjust the cron input controls accordingly.
  NOTE: when a new tab is selected, the old values are wiped.
  */
  handleScheduleChange = (value, initial=false) => {
    const { minutesVal, hoursVal, domVal, monthsVal, dowVal } = this.state;

    let vals = selectionMatrix[value];

    this.setState({ selectedSchedule : value, minuteDisabled: vals[0], hourDisabled: vals[1], domDisabled: vals[2],
                    monthDisabled: vals[3], dowDisabled: vals[4], minutesAsSelect: vals[5], hoursAsSelect: vals[6],
                    domAsSelect: vals[7], monthAsSelect: vals[8], dowAsSelect: vals[9] });

    if(value === 'custom') {
      this.computeCronValue(minutesVal, hoursVal, domVal, monthsVal, dowVal);
      return;
    }

    let newState = {};
    const number = /^\d+$/;

    if(initial == true) {
      newState = {minutesVal: minutesVal, hoursVal: hoursVal, domVal: domVal, monthsVal: monthsVal, dowVal: dowVal};
    } else {
      switch(value) {
        case 'minutely':
          newState = {minutesVal: '*', hoursVal: '*', domVal: '*', monthsVal: '*', dowVal: '*'};
          break;
        case 'hourly':
          newState = {hoursVal: '*', domVal: '*', monthsVal: '*', dowVal: '*'};
          break;
        case 'daily':
          newState = {hoursVal: '*', domVal: '*', monthsVal: '*', dowVal: '*'};
          break;
        case 'weekly':
          newState = {domVal: '*', monthsVal: '*'};
          break;
        case 'monthly':
          newState = {monthsVal: '*', dowVal: '*'};
          break;
        case 'yearly':
          newState = {dowVal: '*'};
          break;
      }

      if(value === 'hourly') {
        newState['minutesVal'] = minutesVal.match(number) ? minutesVal : '0';
      }
      if((value === 'daily' || value === 'weekly' || value === 'monthly' || value === 'yearly')) {
        newState['minutesVal'] = minutesVal.match(number) ? minutesVal : '0';
        newState['hoursVal'] = hoursVal.match(number) ? hoursVal : '0';
      }
      if(value === 'weekly') {
        newState['dowVal'] = dowVal.match(number) ? dowVal : '0';
      }
      if(value === 'monthly') {
        newState['domVal'] = domVal.match(number) ? domVal : '1';
      }
      if(value === 'yearly') {
        newState['domVal'] = domVal.match(number) ? domVal : '1';
        newState['monthsVal'] = monthsVal.match(number) ? monthsVal : '1';
      }
    }

    console.log(newState);

    setAsyncState(this, newState)
    .then(() => {
      this.computeCronValue(newState['minutesVal'], newState['hoursVal'], newState['domVal'], newState['monthsVal'], newState['dowVal']);
    });
  }

  /*
  When changes are made to the individual cron controls, whether they're select boxes or input boxes, this function gets called
  */
  handleCronChanged = (e) => {
    let { minutesVal, hoursVal, domVal, monthsVal, dowVal } = this.state;

    let newState = {};

    switch(e.target.id) {
      case 'formGroupMinute':
        newState['minutesVal'] = e.target.value;
        break;
      case 'formGroupHour':
        newState['hoursVal'] = e.target.value;
        break;
      case 'formGroupDOM':
        newState['domVal'] = e.target.value;
        break;
      case 'formGroupMonth':
        newState['monthsVal'] = e.target.value;
        break;
      case 'formGroupDOW':
        newState['dowVal'] = e.target.value;
        break;
    }

    setAsyncState(this, newState)
    .then(() => {
      this.computeCronValue(this.state.minutesVal, this.state.hoursVal, this.state.domVal, this.state.monthsVal, this.state.dowVal);
    });
  }

  render() {
    const { minutesVal, hoursVal, domVal, monthsVal, dowVal, minutesAsSelect, hoursAsSelect, domAsSelect, monthAsSelect, dowAsSelect,
            minuteDisabled, hourDisabled, domDisabled, monthDisabled, dowDisabled, description, timezone, selectedSchedule } = this.state;

    return (
      <React.Fragment>
        <Form.Label>{I18n.t('jobs.tooltips.cron_instructions')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.tooltips.cron')} />
        <ButtonToolbar aria-label={I18n.t('jobs.tooltips.cron_instructions')}>
          <ToggleButtonGroup value={selectedSchedule} onChange={this.handleScheduleChange} size="sm" type="radio" name="schedules" className="mr-2" aria-label="Predefined Schedules" toggle>
            <ToggleButton value="minutely" variant="secondary" type="radio">{I18n.t('jobs.cron_buttons.minutely')}</ToggleButton>
            <ToggleButton value="hourly" variant="secondary" type="radio">{I18n.t('jobs.cron_buttons.hourly')}</ToggleButton>
            <ToggleButton value="daily" variant="secondary" type="radio">{I18n.t('jobs.cron_buttons.daily')}</ToggleButton>
            <ToggleButton value="weekly" variant="secondary" type="radio">{I18n.t('jobs.cron_buttons.weekly')}</ToggleButton>
            <ToggleButton value="monthly" variant="secondary" type="radio">{I18n.t('jobs.cron_buttons.monthly')}</ToggleButton>
            <ToggleButton value="yearly" variant="secondary" type="radio">{I18n.t('jobs.cron_buttons.yearly')}</ToggleButton>
            <ToggleButton value="custom" variant="secondary" type="radio">{I18n.t('jobs.cron_buttons.custom')}</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <Form.Row className="pt-3 md-6">
          <Form.Group as={Col} md="2" controlId="formGroupMinute">
            <Form.Label>{I18n.t('jobs.cron_fields.minute')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.cron_fields.minute_tooltip')} />
            {minutesAsSelect ? (
            <SelectBoxComponent value={minutesVal} items={minutesList} onChange={this.handleCronChanged} />
            ) : (
            <Form.Control value={minutesVal} disabled={minuteDisabled} onChange={this.handleCronChanged} />
            )}
          </Form.Group>
          <Form.Group as={Col} md="2" controlId="formGroupHour">
            <Form.Label>{I18n.t('jobs.cron_fields.hour')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.cron_fields.hour_tooltip')} />
            {hoursAsSelect ? (
            <SelectBoxComponent value={hoursVal} items={hoursList} onChange={this.handleCronChanged} />
            ) : (
            <Form.Control value={hoursVal} disabled={hourDisabled} onChange={this.handleCronChanged} />
            )}
          </Form.Group>
          <Form.Group as={Col} md="2" controlId="formGroupDOM">
            <Form.Label>{I18n.t('jobs.cron_fields.day_of_month')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.cron_fields.day_of_month_tooltip')} />
            {domAsSelect ? (
            <SelectBoxComponent value={domVal} items={domList} onChange={this.handleCronChanged} />
            ) : (
            <Form.Control value={domVal} disabled={domDisabled} onChange={this.handleCronChanged} />
            )}
          </Form.Group>
          <Form.Group as={Col} md="2" controlId="formGroupMonth">
            <Form.Label>{I18n.t('jobs.cron_fields.month')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.cron_fields.month_tooltip')} />
            {monthAsSelect ? (
            <SelectBoxComponent value={monthsVal} items={monthList} onChange={this.handleCronChanged} />
            ) : (
            <Form.Control value={monthsVal} disabled={monthDisabled} onChange={this.handleCronChanged} />
            )}
          </Form.Group>
          <Form.Group as={Col} md="2" controlId="formGroupDOW">
            <Form.Label>{I18n.t('jobs.cron_fields.day_of_week')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.cron_fields.day_of_week_tooltip')} />
            {dowAsSelect ? (
              <SelectBoxComponent value={dowVal} items={dowList} onChange={this.handleCronChanged} />
            ) : (
            <Form.Control value={dowVal} disabled={dowDisabled} onChange={this.handleCronChanged} />
            )}
          </Form.Group>
        </Form.Row>
        <Form.Label>{description}</Form.Label>
      </React.Fragment>
    );
  }
}

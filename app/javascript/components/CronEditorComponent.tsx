import React from 'react';
import axios from 'axios';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { configureAxios } from './AjaxUtils';
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

var minutesList = [];
var hoursList = [];
var domList = [];

for(var i = 0; i < 60; i++) {
  minutesList.push({val: i, display: i});
}
for(var i = 0; i < 24; i++) {
  hoursList.push({val: i, display: i});
}
for(var i = 1; i < 32; i++) {
  domList.push({val: i, display: i});
}

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
    };
  }

  componentDidMount() {
    this.fetchEnglishCron();
    this.setSelectedScheduleFromCron();
  }

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
      this.setState({description: response.data.description.toLowerCase()});
    });
  }

  setSelectedScheduleFromCron = () => {
    const { cron } = this.state;

    const components = cron.split(' ');
    const minutes = components[0];
    const hours = components[1];
    const dom = components[2];
    const month = components[3];
    const dow = components[4];

    this.setState({minutesVal: minutes, hoursVal: hours, domVal: dom, monthsVal: month, dowVal: dow});
    const number = /^\d+$/;

    // Start off custom and see if we match one of the predefined schedules
    this.handleScheduleChange('custom');

    // Start with the simplest. If everything is '*' then it's a minutely job
    if(minutes === '*' && hours === '*' && dom === '*' && month === '*' && dow === '*')
    {
      this.handleScheduleChange('minutely');
    }

    // If we have single numbers in minute and hour slot, then we're hourly
    if(minutes.match(number) && hours.match(number) && dom === '*' && month === '*' && dow === '*')
    {
      this.handleScheduleChange('hourly');
    }

    // If we have */60 in the minute slot, then we're hourly
    if(minutes === '*/60' && hours === '*' && dom === '*' && month === '*' && dow === '*')
    {
      this.handleScheduleChange('hourly');
    }
  }

  handleScheduleChange = (value) => {
    var vals = selectionMatrix[value];

    this.setState({ selectedSchedule : value, minuteDisabled: vals[0], hourDisabled: vals[1], domDisabled: vals[2],
                    monthDisabled: vals[3], dowDisabled: vals[4], minutesAsSelect: vals[5], hoursAsSelect: vals[6],
                    domAsSelect: vals[7], monthAsSelect: vals[8], dowAsSelect: vals[9]});
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
            <SelectBoxComponent items={minutesList} />
            ) : (
            <Form.Control value={minutesVal} disabled={minuteDisabled} />
            )}
          </Form.Group>
          <Form.Group as={Col} md="2" controlId="formGroupHour">
            <Form.Label>{I18n.t('jobs.cron_fields.hour')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.cron_fields.hour_tooltip')} />
            {hoursAsSelect ? (
            <SelectBoxComponent items={hoursList} />
            ) : (
            <Form.Control value={hoursVal} disabled={hourDisabled} />
            )}
          </Form.Group>
          <Form.Group as={Col} md="2" controlId="formGroupDOM">
            <Form.Label>{I18n.t('jobs.cron_fields.day_of_month')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.cron_fields.day_of_month_tooltip')} />
            {domAsSelect ? (
            <SelectBoxComponent items={domList} />
            ) : (
            <Form.Control value={domVal} disabled={domDisabled} />
            )}
          </Form.Group>
          <Form.Group as={Col} md="2" controlId="formGroupMonth">
            <Form.Label>{I18n.t('jobs.cron_fields.month')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.cron_fields.month_tooltip')} />
            {monthAsSelect ? (
            <SelectBoxComponent items={monthList} />
            ) : (
            <Form.Control value={monthsVal} disabled={monthDisabled} />
            )}
          </Form.Group>
          <Form.Group as={Col} md="2" controlId="formGroupDOW">
            <Form.Label>{I18n.t('jobs.cron_fields.day_of_week')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.cron_fields.day_of_week_tooltip')} />
            {dowAsSelect ? (
              <SelectBoxComponent items={dowList} />
            ) : (
            <Form.Control value={dowVal} disabled={dowDisabled} />
            )}
          </Form.Group>
        </Form.Row>
        <Form.Label>{I18n.t('jobs.schedule_description', {description: description, timezone: timezone})}</Form.Label>
      </React.Fragment>
    );
  }
}

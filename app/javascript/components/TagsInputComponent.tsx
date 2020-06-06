import React, { Component } from 'react';
import axios from 'axios';
import { render } from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';

import './reactTags.css';

import { configureAxios } from './AjaxUtils';
import { setAsyncState } from './ReactUtils';

export default class TagsInputComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      suggestions: []
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  componentDidMount() {
    let tags = [];
    let suggestions = [];

    if(this.props.tags !== '')
    {
      tags = this.props.tags.split(",").map(tag => {
        let container = {};
        container['id'] = tag;
        container['text'] = tag;
        return container;
      });
    }

    configureAxios();
    axios.get(`/tags`)
    .then((response) => {
      let sug = response.data;
      if(sug !== '')
      {
        suggestions = sug.map(tmp => {
          let container = {};
          container['id'] = tmp;
          container['text'] = tmp;
          return container;
        })
      }
      this.setState({tags: tags, suggestions: suggestions});
    });
  }

  handleDelete(i) {
    setAsyncState(this, {tags: this.state.tags.filter((tag, index) => index !== i)})
    .then(() => {
      let tag_string = this.tagsToString();
      this.props.onChange(tag_string);
    });
  }

  handleAddition(tag) {
    const { tags } = this.state;
    setAsyncState(this, {tags: [...tags, tag]})
    .then(() => {
      let tag_string = this.tagsToString();
      this.props.onChange(tag_string);
    });
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }

  tagsToString = () => {
    const { tags } = this.state;
    let tagArray = [];
    Object.keys(tags).forEach(function(key) {
      let item = tags[key];
      tagArray.push(item.text);
    });
    let tagString = tagArray.join(",");
    return tagString;
  }

  render() {
    const { tags, suggestions } = this.state;
    return (
        <ReactTags
          tags={tags}
          inline
          autoComplete="true"
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          classNames={{
            tags: 'ReactTags__tags',
            tagInput: 'ReactTags__tagInput',
            tagInputField: 'form-control',
            selected: 'ReactTags__selected',
            tag: 'ReactTags__selected ReactTags__tag',
            remove: 'ReactTags__selected ReactTags__remove',
            suggestions: 'ReactTags__suggestions',
            activeSuggestion: 'ReactTags__activeSuggestion'
          }}
        />
    );
  }
}

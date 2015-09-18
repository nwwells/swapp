"use strict";

import React from 'react';

export default class DataDrivenComponent extends React.Component {

	constructor(props) {
		super(props)
		if (!this.state) this.state = {};
		this.dataPaths = {};
		if (props.parent) props.parent.addChild(this);
		this.children = [];
	}

	getData(path) {
		this.dataPaths[path] = true;
		return this.props.data.get(path);
	}

	addChild(child) {
		this.children.push(child)
	}

	componentDidMount () {
		this._setTimestamps();
	}

	shouldComponentUpdate (nextProps, nextState) {
		return this.isChanged();
	}

	isChanged () {
		return this.props.data.isChanged(this.state.dataTimestamps) ||
			this.children.some(child => child.isChanged());
	}

	componentDidUpdate (prevProps, prevState) {
		this._setTimestamps();
	}

	_setTimestamps() {
		this.setState({ 
			dataTimestamps: this.props.data.stamps(Object.keys(this.dataPaths))
		});
		// clear out dataPaths so that we can find all the dependencies next
		// time we render.
		this.dataPaths = {};
	}

}
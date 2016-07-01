import React, { Component } from 'react';

/**
 * This is the widget base class. Every widget first goes through this class
 * if I ever want to write code that applies to all widgets this is the place!
 */
export default class Widget extends Component {
    propTypes:{
        children: React.PropTypes.element.isRequired
    }
    constructor(props) {
        super(props);
    }
    render() {
        let styles = {
            widget: {
                backgroundColor: this.props.color
            }
        };

        return (
            <li className="widget" style={styles.widget} data-row={this.props.row} data-col={this.props.col} data-sizex={this.props.sizex} data-sizey={this.props.sizey}>
                {this.props.children}
            </li>
        );
    };
}

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

        console.log(props.name)

        this.timer = 0;
    }

    mouseDown()
    {
        this.timer = setTimeout(function()
            {
                this.editWidgets();
            }.bind(this), 1000);
    }

    mouseUp()
    {
        clearTimeout(this.timer);
    }

    editWidgets()
    {
        this.props.onClickEdit(true);

        $(document).keydown(function(e)
        {
            if(e.which == 27)
            {
                this.props.onClickEdit(false);
            }
        }.bind(this));

        $("html, body").on("click", function(e)
        {
            if(!$(e.target).closest(".widget").length)
                this.props.onClickEdit(false);
        }.bind(this));
    }
    
    render()
    {
        let styles = {
            widget: {
                backgroundColor: this.props.color
            }
        };

        var editing = "",
              classNames = "widget"

        $('.widget').removeClass('editing');

        if(this.props.editing)
        {
            $('.widget').addClass('editing');
            editing = (<i className="material-icons remove-widget" onClick={this.props.onClick}>cancel</i>);
        }

        return (
            <li onMouseUp={this.mouseUp.bind(this)} onMouseDown={this.mouseDown.bind(this)} className={classNames} style={styles.widget} data-row={this.props.row} data-col={this.props.col} data-sizex={this.props.sizex} data-sizey={this.props.sizey} data-name={this.props.name}>
                {editing}
                {this.props.children}
            </li>
        );
    };
}

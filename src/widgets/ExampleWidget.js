import React, { Component } from 'react';

/**
 * If you're about to create a new widget you can copy / paste this into a new
 * file and rename it :)
 */
export default class ExampleWidget extends Component {
    constructor(props) {
        super(props);

        //Simple toggle variable.
        this.isClicked = false;

        //This is the state of the application
        //update this with setState({'text':'demo'})
        //after you call setstate the template will be rerendered
        this.state =
        {
            text: "Example widget"
        };

        //Bind this to the click function so that it preservers this 'this' value
        this.clicked = this.clicked.bind(this);
    }

    /**
     * componentDidMount is called when the component shows up in the view
     */
    componentDidMount()
    {
        console.log('Example Widget mounted')
    }

    /**
     * componentWillUnmount is called when the component is going to leave
     * the view. This is the place to cleanup everything (clear your intervals
     * for example)
     */
    componentWillUnmount()
    {
        console.log('Widget unmounted')
    }

    /**
     * The click function is called by the onClick event in
     * the template of this widget
     */
    clicked()
    {
        //Change the text based on the isClicked value
        let text = this.isClicked ? "Example widget" : "Clicked!";

        //Set the application text state (this will trigger a re-render)
        this.setState({text: text});

        //Toggle the isClicked variable
        this.isClicked = !this.isClicked;
    }

    /**
     * The render function is called when a setState is called but also on page
     * load etc
     * @returns {XML}
     */
    render()
    {

        // There are two ways of binding styles. This is one way to do it.
        // If you have a lot of styles you can create a new .css file and
        // include it at the top. Look at GraphWidget.js
        let styles = {
            exampleClassName: {
                padding: 20,  // Becomes "10px" when rendered.
                color: "white",
                fontSize:20,
                textAlign: "center"
            },
            smallText: {
                padding: 10,  // Becomes "10px" when rendered.
                color: "white",
                fontSize:10,
                textAlign: "center",
                display: "block"
            }
        };

        // This is the HTML returned by the widget. You see the clicked state
        // is shown and the this.clicked function is binded to an event
        return (
            <h1 style={styles.exampleClassName} onClick={this.clicked}>
                {this.state.text}

                <span style={styles.smallText}>
                    Click me!
                </span>
            </h1>
        );
    };
}
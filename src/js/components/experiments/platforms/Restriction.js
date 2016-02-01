import React from "react";

/**
 * @author Niklas Keller
 */
class Restriction extends React.Component {
    constructor() {
        super();

        this.state = {
            acceptedAnswers: {}
        };
    }

    componentDidMount() {
        let answers = this.props.item.acceptedAnswers || [];

        if (answers.length === 0) {
            // If there are no accepted answers, it's a new item and we default to true
            answers = this.props.item.answers || [];
        }

        let acceptedAnswers = {};

        for (let i = 0; i < answers.length; i++) {
            acceptedAnswers[answers[i]] = answers[i];
        }

        this.setState({
            acceptedAnswers: acceptedAnswers
        });
    }

    render() {
        let answers = this.props.item.answers.map((answer) => (
            <label key={answer}>
                <input type="checkbox" checked={answer in this.state.acceptedAnswers}
                       onClick={() => this._toggleAnswer(answer)}/> {answer}
            </label>
        ));

        return (
            <div className="restriction">
                <span className="restriction-name">{this.props.item.name}</span>

                <div className="restriction-answers">
                    {answers}
                </div>
            </div>
        );
    }

    _toggleAnswer(answer) {
        let answers = this.state.acceptedAnswers;

        if (answer in answers) {
            delete answers[answer];
        } else {
            answers[answer] = answer;
        }

        this.setState({
            acceptedAnswers: answers
        });

        let item = this.props.item;
        item.acceptedAnswers = Object.keys(this.state.acceptedAnswers);

        this.props.onChange(item);
    }
}

export default Restriction;
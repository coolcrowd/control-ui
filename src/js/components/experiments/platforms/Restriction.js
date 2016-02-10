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


        for (let i = 0; i < answers.length; i++) {
            this._toggleAnswer(answers[i].id);
        }
    }

    render() {
        let answers = this.props.item.answers.map((answer) => (
            <label key={answer.id}>
                <input type="checkbox" checked={answer.id in this.state.acceptedAnswers}
                       disabled={!this.props.enabled}
                       onClick={() => this._toggleAnswer(answer.id)}/> {answer.answer}
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
        item.acceptedAnswers = Object.keys(this.state.acceptedAnswers).map((key) => {
            return {
                id: key,
                answer: this.state.acceptedAnswers[key]
            }
        });

        this.props.onChange(item);
    }
}

export default Restriction;
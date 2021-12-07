import React from "react";
import '@picocss/pico/css/pico.css';


class App extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            polls: []
        }
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        fetch('/api/polls/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data =>
                this.setState({
                    polls: data.map(poll => {
                        poll.total_votes = poll.choices.reduce(
                            (previousValue, currentValue) => previousValue + currentValue.votes, 0)
                        return poll;
                    })
                })
            )
            .catch((error) => console.error('Refresh Error:', error))
    }

    vote(choice) {
        fetch('/api/polls/vote/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({choice: choice})
        })
            .then(() => this.refresh())
            .catch((error) => console.error('Vote Error:', error))
    }

    render() {
        return (
            <div className={"container"}>
                <header><h1>Polls</h1></header>
                <main>
                    {this.state.polls.map((poll) =>
                        <details key={poll.id}>
                            <summary>{poll.question_text}</summary>
                            {poll.choices.length > 0}
                            {poll.choices.map((choice) =>
                                <button key={choice.id}
                                        style={{
                                            background: `linear-gradient( to right, 
                                        var(--primary-hover) 
                                        ${choice.votes * 100 / (poll.total_votes === 0 ? poll.total_votes + 1 : poll.total_votes)}%, 
                                        var(--primary) 
                                        ${(choice.votes * 100 + 0.1) / (poll.total_votes === 0 ? poll.total_votes + 1 : poll.total_votes)}%)`
                                        }}
                                        onClick={() => this.vote(choice.id)}>
                                    <strong style={{
                                        color: "var(--progress-background-color)",
                                        float: "left",
                                        minWidth: "80px"
                                    }}>
                                        <span>{choice.votes} </span>
                                        <sub>votes</sub>
                                    </strong>
                                    <strong>
                                        {choice.choice_text}
                                    </strong>
                                </button>
                            )}
                        </details>
                    )}
                </main>
            </div>
        );
    }
}

export default App;

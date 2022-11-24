import './TypeAheadDropDown.css'
import React from 'react';


export default class TypeAheadDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            text: ''
        }
    }

    onTextChange = (e) => {
        const { items } = this.props;
        let suggestions = [];
        const value = e.target.value;
        if (value.length > 0) {
            const regex = new RegExp(`${value}`, `i`);
            suggestions = items.sort().filter(v => regex.test(v));
        }

        const requestSuggestions = (value) => {
            let query = `MATCH (a:Actor1) WHERE a.login =~ '(?i).*${value}.*' RETURN a limit 10`;
            query = new URLSearchParams({ q: query })
            const url = '/query?' + query;
            return fetch(url).then(response => response.json())
        }
        requestSuggestions(value).then((suggestions) => {
            suggestions = suggestions.map((s) => s.a.login);
            this.setState(() => ({ suggestions, text: value }));
        });

        this.setState(() => ({
            suggestions,
            text: value
        }));
    }

    suggestionSelected = (value) => {
        this.setState(() => ({
            text: value,
            suggestions: []
        }))
        const { onSelected } = this.props;
        onSelected(value);
    }

    renderSuggestions = () => {
        const { suggestions } = this.state;
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul>
                {suggestions.map(actor => <li key={actor} onClick={(e) => this.suggestionSelected(actor)}>{actor}</li>)}
            </ul>
        )
    }


    render() {
        const { text } = this.state
        return (
            <div className="TypeAheadDropDown">
                <input onChange={this.onTextChange} placeholder="Select GitHub User" value={text} type="text" />
                {this.renderSuggestions()}
            </div>
        );
    }

}
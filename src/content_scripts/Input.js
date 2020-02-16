import React from 'react';

class Input extends React.Component {
	constructor(props) {
		super(props);
		this.timeout = null;
	}

	handleChange = (event) => {
		const target = event.target;
		this.props.onInputChange(target.value);

		clearTimeout(this.timeout);
		this.timeout = setTimeout((target) => {
			this.props.onInputTimeout(target.value);
			target.select();
		}, 700, target);
	}

	render() {
		console.log("Input re-rendered");
		return (
			<div className="word">
				<input
					type="text"
					onMouseOver={(e) => { e.target.select(); }}
					onChange={this.handleChange}
					value={this.props.word} >
				</input>


			</div>
		)
	}
}

export default Input;
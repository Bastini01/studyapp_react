import React from 'react';
import SwitchSelector from "react-switch-selector";
 
class ExerciseChoice extends React.Component{

    constructor(props) {
        super(props);
      }

    render(){return <SwitchSelector
        onChange={this.props.handler}
        options={this.props.opt}
        initialSelectedIndex={this.props.init}
        backgroundColor={"#353b48"}
        fontColor={"#f5f6fa"}
        />;}
};

export default ExerciseChoice;

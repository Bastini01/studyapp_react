import React from "react";
import { CheckBox } from "react-native-web";

class Deck extends React.Component{
  constructor(props) {
    super(props)
  }

  render(){return(
    <span>{this.props.r[3]}  <CheckBox 
      value={this.props.selected}
      onValueChange={
        (val) => 
        this.props.handleSelect(val, this.props.r, this.props.i)}
      /></span>)
  }
}

class DeckList extends React.Component{

  constructor(props) {
      super(props);
      this.state = {
        open: new Set(),
      };
      this.decks = new Object(this.props.decks)
    }

    getCounts(r, nw, rv){
        nw = nw || 0
        rv = rv || 0
        if(r.length != 5){
          if(r.cardTemplate === this.props.exercise){
          return [r.newCount, r.reviewCount]}
          else {return [0, 0]}
        }
        else if (r.length == 5) {
          let x = 0
          let y = 0
          r[4].map((c) => {
            x += this.getCounts(c, nw, rv)[0]
            y += this.getCounts(c, nw, rv)[1]})
          nw += x; rv += y
        }
        return [nw, rv]
      }

    generateRow = (r) => {
   
    const handleExpand = () => {
      let set = this.state.open
      set.add(r[2]);
      this.setState({open: set});
    };

    const handleCollapse = () => {
      let set = new Set(this.state.open)
      set.delete(r[2]);
      this.setState({open: set});
    };
    return (
      <div key={r[2]}>
          <Deck r={r}
            handleSelect={this.props.handleSelect}
            selected={this.props.selection.has(r[2])}/>
          &nbsp;
          {r.length == 5 && (<span>new: {this.getCounts(r)[0]} rev: {this.getCounts(r)[1]}</span>) }
          {!this.state.open.has(r[2]) && r[0] < 3 && (
            <button id={r[2]} onClick={handleExpand}>&#x2193;</button>

          )}
          {this.state.open.has(r[2]) && r[0] < 3 && (
            <button id={r[2]} onClick={handleCollapse}>&#x2191;</button>
          )}
        {this.state.open.has(r[2]) && (
          <ul>
            {r[4].map((child, index) => {
              if (child.length == 5){
              return (
                <li key={r[2]+index.toString()}>{this.generateRow(child)} </li>
              );}
            })}
          </ul>
        )}
        <ol></ol>
      </div>
    );
  };
  
  render(){ 
    console.log("selection: ")
    console.log(this.props.selection)
    return this.props.decks.map((book) => {return this.generateRow(book)})}
};

export default DeckList;
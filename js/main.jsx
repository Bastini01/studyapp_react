import React from 'react';
import ReactDOM from "react-dom";
import ExerciseChoice from './components/exercise_choice.jsx';
import DeckList from './components/decklist.jsx';
import { Button } from "react-native-web";

const exerciseOptions = [
    {
        label: "Write",
        value: "write",
        selectedBackgroundColor: "#fbc531"
    },
    {
        label: "Read",
        value: "read",
        selectedBackgroundColor: "#fbc531"
    },
    {
        label: "Listen",
        value: "listen",
        selectedBackgroundColor: "#fbc531"
    },
 ];

const initialDirection = "write"

function exerciseIndex(exerciseValue) {return exerciseOptions.findIndex(({value}) => value === exerciseValue)}

class Selection extends React.Component{
    constructor(props) {
        super(props)
        this.dids = new Set()
    }
    getCounts(r, nw, rv){ //TO FIX eliminate deduplication and make dids array instead of set
        nw = nw || 0
        rv = rv || 0
        if(r.length != 5){
          if(r.cardTemplate === this.props.exercise){
            this.dids.add(r.id.toString()) //ADD DID TO SELECTION (TODO: change backend to accept numbers?)
          return [r.newCount, r.reviewCount]}
          else {return [0, 0]}
        }
        else if (r.length == 5) {
          if (r[0] == 3 && !this.props.selection.has(r[2])){
            return [0, 0]
          }
          let x = 0
          let y = 0
          r[4].map((c) => {
            x += this.getCounts(c, nw, rv)[0]
            y += this.getCounts(c, nw, rv)[1]})
          nw += x; rv += y
        }
        return [nw, rv]
      }
    buttonAction = () => {
        if (this.dids.size > 0){
          let requestBody = {dids: Array.from(this.dids)}
          fetch(window.location.origin+"/api/select_voc",{
              method: 'POST',
              body: JSON.stringify(requestBody),
              headers: new Headers({
                  'X-CSRFToken': getCookie('csrftoken'),
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }),
          }).then((response) => response.json())
          .then(window.open(window.location.origin+"/study","_self"))
          }
        else {alert("please select at least one unit")}
  }

    render(){
        if (this.props.decks.length == 0){return <div>loading</div>}
        this.dids = new Set()
        let cnts = this.getCounts(this.props.decks[0])
        console.log(this.dids)
        return <div>new: {cnts[0]}, rev: {cnts[1]}
                <Button title="STUDY NOW" onPress={this.buttonAction}/></div>
    }
    }

class HomePage extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            exercise: exerciseIndex(initialDirection),
            data: {userName: 'loading', decks: []},
            selection: new Set()
            };
        this.changeExercise = this.changeExercise.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
      }
      componentDidMount(){
        fetch(window.location.origin+"/api/home2", 
        // {headers: new Headers({
        //     // "X-CSRFToken": csrftoken
        // // 'Authorization': 'Basic '+btoa('username:password'), 
        // // 'Content-Type': 'application/x-www-form-urlencoded'
        // })}
        ).then((response) => response.json())
        .then(data => {
            console.log("api call")
            this.setState({data: data})
        });
      }

    changeExercise = (newValue) => {
        console.log(newValue)
        this.setState({exercise: exerciseIndex(newValue)})
    };

    handleSelect = (value, r) => {      
        let set = new Set(this.state.selection)
        const getRids = (r, lst) => {
          lst = lst || []
          if (r.length == 5){
          r[4].map((c) => {
              getRids(c, lst).forEach(item => {
                if (item instanceof String) {lst.push(item)}}
              )
            })
            lst.push(r[2])
          }
        return lst
        }
        let selection = getRids(r)
        if (value){selection.forEach(set.add, set)}
        else {selection.forEach(set.delete, set)}
        this.setState({selection: set})
      };

    render(){
        return [
                    <ExerciseChoice 
                        key="ExerciseChoice" 
                        handler={this.changeExercise} 
                        opt={exerciseOptions} 
                        init={this.state.exercise}/>,
                    <Selection
                        key="Selection"
                        exercise={exerciseOptions[this.state.exercise].value} 
                        decks={this.state.data.decks}
                        selection={this.state.selection}/>,
                    <DeckList 
                        key="DeckList" 
                        exercise={exerciseOptions[this.state.exercise].value} 
                        decks={this.state.data.decks}
                        selection={this.state.selection}
                        handleSelect={this.handleSelect}/>]
        }
}

// const domContainer = document.querySelector('#home-container');
ReactDOM.render(<HomePage/>, document.getElementById('home-container'));

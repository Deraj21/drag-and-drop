import React, { Component } from 'react';
import './reset.css';
import './App.css';
import data from './data';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      listsData: data.l,
      cardsData: data.c,
      draggingType: '',
      oldId: null
    }
  }

  listStart(e, type, id){
    e.stopPropagation();
    console.log('start:', type, id);
    if (type === 'list'){
      if (!this.state.draggingType){
        type = 'list';
      } else if (this.state.draggingType === 'card'){
        type = 'card';
      }
    }
    console.log(type);
    this.setState( { oldId: id, draggingType: type } );
    
    this.addToClass(type, id, 'dragging');
    setTimeout(() => this.changeClass(type, id, `${type}-placeholder`), 0);
  }

  listEnd(e, type, id){
    e.stopPropagation();
    console.log('end:', type, id);
    this.changeClass(type, id, type);
  }

  listOver(e, type, id){
    e.stopPropagation();
    e.preventDefault();
  }

  // moves item at oldIndex to newIndex, and shifts the rest accordingly
  moveItem(array, oldIndex, newIndex){
    let arr = [...array];
    if (oldIndex === newIndex){
      return arr;
    }
  
    let temp = arr.splice(oldIndex, 1)[0];
    arr.splice(newIndex, 0, temp);
    return arr;
  }

  listEnter(e, type, id){
    e.stopPropagation();
    console.log('enter:', type, id);
    // setup
    // e.preventDefault();
    let { listsData, cardsData, oldId } = this.state;

    // change styling
    this.addToClass(type, id, `${type}-placeholder`);
    if (oldId !== id){
      this.changeClass(type, oldId, type);
    }

    // find indexes based on id
    let oldIndex = null;
    let newIndex = null;
    let newArr;
    if (type === 'list'){
      oldIndex = listsData.findIndex(item => item.list_id === oldId);
      newIndex = listsData.findIndex(item => item.list_id === id);
      newArr = this.moveItem(listsData, oldIndex, newIndex);
      this.setState({ listsData: newArr, oldIndex: newIndex });
    } else if (type === 'card') {
      oldIndex = cardsData.findIndex(item => item.card_id === oldId);
      newIndex = cardsData.findIndex(item => item.card_id === id);
      newArr = this.moveItem(cardsData, oldIndex, newIndex);
      this.setState({ cardsData: newArr, oldIndex: newIndex });
    }

    // get new order of items & setState
  }

  listLeave(e, type, id){
    e.stopPropagation();
  }

  listDrop(e, type, id){
    e.stopPropagation();
    this.changeClass(type, id, type);
  }

  // changes or adds to className
  changeClass(type, id, newClass){
    document.querySelector(`#${type}-${id}`).className = newClass;
  }
  addToClass(type, id, addition){
    document.querySelector(`#${type}-${id}`).className += (' ' + addition);
  }

  render() {
    let { listsData, cardsData } = this.state;
    let lists = listsData.map(list => {
      let cards = cardsData.filter(card => card.list_id === list.list_id).map(card => {
        return (
          <div
          draggable="true"
          // onDragStart={e => this.listStart(e, 'card', card.card_id)}
          // onDragEnd={e => this.listEnd(e, 'card', card.card_id)}
          // onDragOver={e => this.listOver(e, 'card', card.card_id)}
          // onDragEnter={e => this.listEnter(e, 'card', card.card_id)}
          // onDragLeave={e => this.listLeave(e, 'card', card.card_id)}
          // onDrop={e => this.listDrop(e, 'card', card.card_id)}
          className="card" id={`card-${card.card_id}`}>
            <h3>{card.card_name}</h3>
          </div>
        );
      });
      return (
        <div
        draggable="true"
        onDragStart={e => this.listStart(e, 'list', list.list_id)}
        onDragEnd={e => this.listEnd(e, 'list', list.list_id)}
        onDragOver={e => this.listOver(e, 'list', list.list_id)}
        onDragEnter={e => this.listEnter(e, 'list', list.list_id)}
        onDragLeave={e => this.listLeave(e, 'list', list.list_id)}
        onDrop={e => this.listDrop(e, 'list', list.list_id)}
        className="list" id={`list-${list.list_id}`}>
          <h2>{list.list_name}</h2>
          { cards }
        </div>
      );
    });

    return (
      <div className="App">
        { lists }
      </div>
    );
  }
}

export default App;

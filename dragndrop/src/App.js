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
      oldId: null
    }
  }

  dragStart(type, id){
    this.setState( { oldId: id } );
    
    this.addToClass(type, id, 'dragging');
    setTimeout(() => this.changeClass(type, id, `${type}-placeholder`), 0);
  }

  dragEnd(type, id){
    this.changeClass(type, id, type);
  }

  dragOver(e, type, id){
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

  dragEnter(e, type, id){
    // setup
    e.preventDefault();
    let { listsData, oldId } = this.state;

    // change styling
    this.addToClass(type, id, `${type}-placeholder`);
    if (oldId !== id){
      this.changeClass(type, oldId, type);
    }

    // find indexes based on id
    let oldIndex = listsData.findIndex(list => list.list_id === oldId);
    let newIndex = listsData.findIndex(list => list.list_id === id);

    // get new order of items & setState
    let newArr = this.moveItem(listsData, oldIndex, newIndex);
    this.setState({ listsData: newArr, oldIndex: newIndex });
  }

  dragLeave(type, id){
  }

  dragDrop(type, id){
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
          // draggable="false"
          // onDragStart={() => this.dragStart('card', card.card_id)}
          // onDragEnd={() => this.dragEnd('card', card.card_id)}
          // onDragOver={e => this.dragOver(e, 'card', card.card_id)}
          // onDragEnter={e => this.dragEnter(e, 'card', card.card_id)}
          // onDragLeave={() => this.dragLeave('card', card.card_id)}
          // onDrop={() => this.dragDrop('card', card.card_id)}
          className="card" id={`card-${card.card_id}`}>
            <h3>{card.card_name}</h3>
          </div>
        );
      });
      return (
        <div
        draggable="true"
        onDragStart={() => this.dragStart('list', list.list_id)}
        onDragEnd={() => this.dragEnd('list', list.list_id)}
        onDragOver={e => this.dragOver(e, 'list', list.list_id)}
        onDragEnter={e => this.dragEnter(e, 'list', list.list_id)}
        onDragLeave={() => this.dragLeave('list', list.list_id)}
        onDrop={() => this.dragDrop('list', list.list_id)}
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

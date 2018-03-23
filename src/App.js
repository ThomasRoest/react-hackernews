import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';



const test_items = [
  {
    title: "React",
    url: "https://facebook.github.io/react/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "https://github.com/reactjs/redux",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1
  },
  {
    title: "python",
    url: "https://github.com/reactjs/redux",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 4
  }
];

function Tabs(props) {
  return (
    <div className="searchtabs">
      <span><a className="btn" href="#" onClick={(e) => props.loadData(e)}>Javascript</a></span>
      <span><a className="btn" href="#" onClick={(e) => props.loadData(e)}>React</a></span>
      <span><a className="btn" href="#" onClick={(e) => props.loadData(e)}>Node</a></span>
      <span><a className="btn" href="#" onClick={(e) => props.loadData(e)}>Vue</a></span>
    </div>
  )
}

function ListItem(props) {
  const commentUrl = `https://news.ycombinator.com/item?id=${props.details.objectID}`
  const { 
    author, 
    title, 
    url, 
    points, 
    objectID,
    num_comments } = props.details;
  return (
    <li className="list-item">
      <span className="list-item__title">
        <a href={url} className="list-item__url">{title}</a>
      </span>
      <span className="list-item__meta">{author}</span>
      <span className="list-item__meta">{points}</span>
      <span className="list-item__meta">
        <a href={commentUrl} className="list-item__commenturl">comments</a>
      </span>
      
      <span className="list-item__meta">{num_comments}</span>
      {/* <span className="list-item__meta">{story_url}</span> */}
    </li>
  );
}

function Header(props) {
  return (
    <header>
      <form className="searchform">
        <input 
          type="text"
          onChange={props.onSearchChange}
        />
      </form>
    </header>
  );
}

function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

function DataContainer(props) {
  const {isLoading, items} = props;
  if(isLoading == 'progress') {
    return (
      <div className="spinner">
      <div className="rect1"></div>
      <div className="rect2"></div>
      <div className="rect3"></div>
      <div className="rect4"></div>
      <div className="rect5"></div>
    </div>
  )
  } else {
    return (
      items.map(item => (
        <ListItem key={item.objectID} details={item} />
      ))
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      searchTerm: "", 
      hn_posts: [], 
      test_items: test_items,
      isLoading: 'finished' }
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.loadData = this.loadData.bind(this);
  }
  
  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }
  
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
    console.log(event.target.value);
  }
  
  
  componentDidMount() {
    // this.setState({ isLoading: 'progress'})
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
    axios.get(url).then(res => {
      const posts = res.data.hits;
      this.setState({ hn_posts: posts });
    });
  }

  loadData(e) {
    const QUERY = e.target.textContent.toLowerCase();
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${QUERY}`;
    this.setState({ isLoading: 'progress'})
    axios.get(url).then(res => {
      const posts = res.data.hits;
      this.setState({ hn_posts: posts, isLoading: 'finished' });
    });
  }


  render() {
    return (
      <div className="App">
        {/* <Header onSearchChange={this.onSearchChange} /> */}
        <Tabs loadData={this.loadData}/>
        <ul className="main-list">
          {/* {this.state.hn_posts.map(item => (
            <ListItem key={item.objectID} details={item} />
          ))} */}
          
          <DataContainer isLoading={this.state.isLoading} items={this.state.hn_posts}/>
          
          {/* {this.state.hn_posts.filter(isSearched(this.state.searchTerm)).map(item => (
            <ListItem key={item.objectID} details={item} />
          ))} */}
        </ul>
      </div>
    );
  }
}

export default App;

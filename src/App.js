import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

// const DEFAULT_QUERY = 'javascript';
// const PATH_BASE = 'https://hn.algolia.com/api/v1';
// const PATH_SEARCH = '/search';
// const PARAM_SEARCH = 'query=';


function Tabs(props) {
  return (
    <div className="searchtabs">
      <span><a className="btn" data-query="javascript" href="#" onClick={(e) => props.loadData(e)}>Javascript</a></span>
      <span><a className="btn" data-query="react" href="#" onClick={(e) => props.loadData(e)}>React</a></span>
      <span><a className="btn" data-query="node" href="#" onClick={(e) => props.loadData(e)}>Node</a></span>
      <span><a className="btn" data-query="vue" href="#" onClick={(e) => props.loadData(e)}>Vue</a></span>
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
    created_at, 
    objectID,
    num_comments } = props.details;
  return (
    <li className="list-item">
      <span className="list-item__title">
        <a href={url} className="list-item__url">{title}</a>
      {/* <p>{created_at}</p> */}
      </span>
        
      <span className="list-item__meta">{author}</span>
      <span className="list-item__meta">points {points}</span>
      <span className="list-item__meta">
        <a href={commentUrl} className="list-item__commenturl">comments</a>
      </span>
      <span className="list-item__meta">{num_comments}</span>
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
      queryFilter: 'recent',
      isLoading: 'finished' }
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.loadData = this.loadData.bind(this);
    this.setfilterQuery = this.setfilterQuery.bind(this);
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

  oneMonthAgo() {
    return Math.floor(new Date().getTime() / 1000 - (60*60*24*30));
  }
  
  
  componentDidMount() {
    const defaultUrl = `http://hn.algolia.com/api/v1/search?query=javascript&numericFilters=created_at_i>${this.oneMonthAgo()}`;
    
    axios.get(defaultUrl).then(res => {
      const posts = res.data.hits;
      this.setState({ hn_posts: posts });
    });
  }

  loadData(e) {

    const { query } = e.target.dataset;

    const url = `http://hn.algolia.com/api/v1/search?query=${query}&numericFilters=created_at_i>${this.oneMonthAgo()}`


    // get correct url and set state
    // const hello = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

    // two params: Query query=javascript, monthfilter &numericFilters=created_at_i>${this.oneMonthAgo()


    // const urlAll = 'http://hn.algolia.com/api/v1/search?query=javascript';
    // const urlOneMonthAgo = `http://hn.algolia.com/api/v1/search?query=javascript&numericFilters=created_at_i>${this.oneMonthAgo()}`
  
    // const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&numericFilters=created_at_i>${this.oneMonthAgo()}`;


    this.setState({ isLoading: 'progress'})


    axios.get(url).then(res => {
      const posts = res.data.hits;
      this.setState({ hn_posts: posts, isLoading: 'finished' });
    });
  //   // debugger;
  }

  setSearchQuery(e) {

    // trigger ajax request with updated filters
  }

  setfilterQuery(e) {
    e.preventDefault();
    console.log(e.target.dataset.filter);
    const queryFilter = e.target.dataset.filter;
    this.setState({ queryFilter });

    // trigger ajax request with updated filters
  }


  render() {
    return (
      <div className="App">
        {/* <Header onSearchChange={this.onSearchChange} /> */}
        <Tabs loadData={this.loadData}/>
        {/* <h1 onClick={this.loadData}>testing</h1> */}
        {/* <div>
          <a href="" data-filter="recent" onClick={(e) => this.setfilterQuery(e)}>most recent</a>
          -
          <a href="" data-filter="popular" onClick={(e) => this.setfilterQuery(e)}>most popular</a>
        </div> */}

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

import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import SearchForm from './SearchForm';

const Button = ({item, currentFilter, handleFilter}) => {
  if(currentFilter === item) {
    return (
      <button className="btn-datefilter btn-active" onClick={(e) => handleFilter(e, item)}>
        {item}
      </button>
    )
  } else {
    return (
      <button className="btn-datefilter" onClick={(e) => handleFilter(e, item)}>
        {item}
      </button>
    )
  }
}

const Header = ({ title }) =>
  <header className="main-header">
    <h1 className="main-title">{title}</h1>
  </header>


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
        <span className="list-item__author">{author}</span>
      </span>
        
      {/* <span className="list-item__meta">{author}</span> */}
      <span className="list-item__meta">points {points}</span>
      <span className="list-item__meta">
        <a href={commentUrl} className="list-item__commenturl">comments ({num_comments})</a>
        
      </span>
    </li>
  );
}

function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

function List(props) {
  const {isLoading, items} = props;
  if(isLoading == 'progress') {
    return (
      <div className="spinner-container">
        <div className="spinner">
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
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
      queryFilters: ['javascript', 'react', 'node', 'vue'], 
      currentQueryfilter: 'javascript',
      dateFilters: ['this month', 'all'], 
      currentDatefilter: 'this month',
      isLoading: 'finished' }
    // this.onSearchChange = this.onSearchChange.bind(this);
    this.filterwithQuery = this.filterwithQuery.bind(this);
    this.filterwithDate = this.filterwithDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  oneMonthAgo() {
    return Math.floor(new Date().getTime() / 1000 - (60*60*24*30));
  }
  
  componentDidMount() {
    const defaultUrl = `https://hn.algolia.com/api/v1/search?query=javascript&numericFilters=created_at_i>${this.oneMonthAgo()}`;
    
    axios.get(defaultUrl).then(res => {
      const posts = res.data.hits;
      this.setState({ hn_posts: posts });
    });
  }

  getUrl(query, dateFilter){
    const BASE_URL = 'https://hn.algolia.com/api/v1/search?query=';
    let url;
      if(dateFilter == 'this month') {
      url = `${BASE_URL}${query}&numericFilters=created_at_i>${this.oneMonthAgo()}`;
    } else if(dateFilter == 'all') {
      url = `${BASE_URL}${query}`;
    }
    return url;
  }

  filterwithQuery(e, item) {
    const query = item; 
    const dateFilter = this.state.currentDatefilter;
    const url = this.getUrl(query, dateFilter);

    this.setState({ isLoading: 'progress', currentQueryfilter: query, searchTerm: ''})
    axios.get(url).then(res => {
      const posts = res.data.hits;
      this.setState({ hn_posts: posts, isLoading: 'finished' });
    });
  }

  filterwithDate(e, item) {
    const filter  = item; 
    const query = this.state.currentQueryfilter;
    const url = this.getUrl(query, filter);

    this.setState({ isLoading: 'progress', currentDatefilter: filter})
    axios.get(url).then(res => {
      const posts = res.data.hits;
      this.setState({ hn_posts: posts, isLoading: 'finished' });
    });
  }

  handleChange(value) {
    this.setState({ searchTerm: value })
  }

  handleSubmit(e) {
    e.preventDefault();
    const url = this.getUrl(this.state.searchTerm, 'all');
    this.setState({ isLoading: 'progress', currentDatefilter: 'all' })
    axios.get(url).then(res => {
      const posts = res.data.hits;
      this.setState({ hn_posts: posts, isLoading: 'finished', currentQueryfilter: this.state.searchTerm });
    });
  }

  render() {
    return (
      <div className="App">
      <Header title={'JS Hackernews'}/>
      <SearchForm 
        handleChange={this.handleChange} 
        handleSubmit={this.handleSubmit}
        formValue={this.state.searchTerm} />
        <div className="button-row">
          {this.state.queryFilters.map(item =>
            <Button
              key={item} 
              item={item} 
              currentFilter={this.state.currentQueryfilter} 
              handleFilter={this.filterwithQuery} />
          )}
        </div>

        <div className="button-row">
          {this.state.dateFilters.map(item =>
            <Button 
              key={item}
              item={item} 
              currentFilter={this.state.currentDatefilter} 
              handleFilter={this.filterwithDate} />
          )}
        </div>

        <ul className="main-list">
          <List isLoading={this.state.isLoading} items={this.state.hn_posts}/>
        </ul>
      </div>
    );
  }
}

export default App;

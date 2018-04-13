import React, { Component } from "react";
import "./App.css";
import axios from "axios";

// const DEFAULT_QUERY = 'javascript';
// const PATH_BASE = 'https://hn.algolia.com/api/v1';
// const PATH_SEARCH = '/search';
// const PARAM_SEARCH = 'query=';

// add arguments to event handler
const Button = ({item, currentFilter, handleFilter}) => {
  // set css class with template string
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

// function Header(props) {
//   return (
//     <header>
//       <form className="searchform">
//         <input 
//           type="text"
//           onChange={props.onSearchChange}
//         />
//       </form>
//     </header>
//   );
// }

function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

function List(props) {
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
      queryFilters: ['javascript', 'react', 'node', 'vue'], 
      currentQueryfilter: 'javascript',
      dateFilters: ['month', 'all'], 
      currentDatefilter: 'month',
      isLoading: 'finished' }
    // this.onSearchChange = this.onSearchChange.bind(this);
    this.filterwithQuery = this.filterwithQuery.bind(this);
    this.filterwithDate = this.filterwithDate.bind(this);
  }
  
  // onSearchChange(event) {
  //   this.setState({ searchTerm: event.target.value });
  //   console.log(event.target.value);
  // }

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
    if(dateFilter == 'month') {
      url = `${BASE_URL}${query}&numericFilters=created_at_i>${this.oneMonthAgo()}`;
    } else if(dateFilter == 'all') {
      url = `${BASE_URL}${query}`;
    }
    return url;
  }

  filterwithQuery(e, item) {
    console.log(`${e} + ${item}`)
    
    const query = item; 
    const dateFilter = this.state.currentDatefilter;
    const url = this.getUrl(query, dateFilter);

    this.setState({ isLoading: 'progress', currentQueryfilter: query})
    axios.get(url).then(res => {
      const posts = res.data.hits;
      this.setState({ hn_posts: posts, isLoading: 'finished'  });
    });
  }

  filterwithDate(e, item) {
    console.log(`${e} + ${item}`)
    
    const filter  = item; 
    const query = this.state.currentQueryfilter;
    const url = this.getUrl(query, filter);

    this.setState({ isLoading: 'progress', currentDatefilter: filter})
    axios.get(url).then(res => {
      const posts = res.data.hits;
      this.setState({ hn_posts: posts, isLoading: 'finished' });
    });
  }

  render() {
    return (
      <div className="App">
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


        {/* <Header onSearchChange={this.onSearchChange} /> */}
        {/* <Tabs filterwithQuery={this.filterwithQuery}/>
        <DateFilters filterwithDate={this.filterwithDate} datefilter={this.state.dateFilter}/> */}
        
        
        <ul className="main-list">
          <List isLoading={this.state.isLoading} items={this.state.hn_posts}/>
        </ul>
      </div>
    );
  }
}

export default App;

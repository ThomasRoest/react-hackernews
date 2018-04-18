import "./SearchForm.css";
import React, { Component } from "react";

const SearchForm = props =>
  <form className="InputAddOn">
    <input type="text" value={props.formValue} className="InputAddOn-field" onChange={(e) => props.handleChange(e.target.value)}/>
    <input type="submit" className="InputAddOn-item" value="search" onClick={(e) => props.handleSubmit(e)}/>
  </form>


export default SearchForm;

{/* <form action="" className='searchform'>
    <input type="text" onChange={(e) => props.handleChange(e.target.value)}/>
    <input type="submit" value="hello there" onClick={(e) => props.handleSubmit(e)}/>
  </form> */}

    
{/* <div class="InputAddOn">
  <input class="InputAddOn-field">
  <button class="InputAddOn-item">…</button>
</div> */}
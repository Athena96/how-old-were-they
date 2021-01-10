import React, { Component } from 'react';
import '../App.css';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {movie: '', movieActors: []};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({movie: event.target.value});
  }


   handleSubmit(event) {
    let currentComponent = this;

    event.preventDefault();

    var unirest = require("unirest");
    var req = unirest("GET", "https://imdb8.p.rapidapi.com/title/find");
    req.query({
      "q": this.state.movie
    });

    req.headers({
      "x-rapidapi-key": "b3d0f31affmshea4203a3aed1012p1d1502jsne567d91a15c7",
      "x-rapidapi-host": "imdb8.p.rapidapi.com",
      "useQueryString": true
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);
    
      const movieYear = parseInt(res.body.results[0].year);
      var movieActors = [];
      for (const actor of res.body.results[0].principals) {
        const id = actor.id.split("/")[2];
        movieActors.push({actor: actor.name, id: id, yob: 0, age: 0 });
        var nreq = unirest("GET", "https://imdb8.p.rapidapi.com/actors/get-bio");
        nreq.query({
          "nconst": id
        });

        nreq.headers({
          "x-rapidapi-key": "b3d0f31affmshea4203a3aed1012p1d1502jsne567d91a15c7",
          "x-rapidapi-host": "imdb8.p.rapidapi.com",
          "useQueryString": true
        });

        nreq.end(function (res) {
          if (res.error) throw new Error(res.error);
      
          const yr = parseInt(res.body.birthDate.split("-")[0])
          const yob = res.body.birthDate.split("-")[0]
          const age = movieYear - yr;

          movieActors.push({actor: actor.name, id: id, yob: yob , age: age });

          currentComponent.setState({movieActors: movieActors});
        });


      }


    });


    
  }
  
  renderActors() {
    var el = []
    for (const actor of this.state.movieActors) {
      if (actor.age === 0) continue;
      el.push(<li key={actor.actor}><b>Actor</b>: {actor.actor} <b>Year Of Birth</b>: {actor.yob} <b>Age</b>: {actor.age}</li>)

    }

    return el

  }


  render() {
    return (

      <div className="main">
        <p><br />
        </p>
        <p><br />
        <i>Have you ever been watching a movie, then wonder how old the actors were when the movie was made? Wonder no longer my friend...  
        </i></p><br />

        <form onSubmit={this.handleSubmit}>
        <label>
          <b>Movie Title</b>: <br/>
          <input type="text" value={this.state.movie} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Search" />
      </form>

      <ul>
      {this.renderActors()}
      </ul>


        <footer align="center" style={{ background: "clear" }}>
          <small >© Copyright howoldwerethey.com | All rights reserved </small>
        </footer>
      </div>



    );
  }
}

export default Home;
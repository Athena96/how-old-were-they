import React, { Component } from 'react';
import { List, ListItem, ListItemContent, CardActions, CardTitle, CardText, Card } from 'react-mdl';
import Spinner from 'react-bootstrap/Spinner'
import '../App.css';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = { isLoading: false, movie: '', movieActors: [] };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ movie: event.target.value });
  }

  handleSubmit(event) {
    if (this.state.movie === "") {
      return
    }
    this.setState({ isLoading: true });
    let currentComponent = this;

    event.preventDefault();

    var unirest = require("unirest");
    var req = unirest("GET", "https://imdb8.p.rapidapi.com/title/find");
    req.query({
      "q": this.state.movie
    });
    console.log("API_KEY: " + process.env.API_KEY);

    req.headers({
      "x-rapidapi-key": "e7d1372ca8msh640de66bbef1f29p158dc7jsn87b53fa8b82a",
      "x-rapidapi-host": "imdb8.p.rapidapi.com",
      "useQueryString": true
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);
      console.log(JSON.stringify(res.body.results[0]));
      currentComponent.setState({ movieData: res.body.results[0] });

      const movieYear = parseInt(res.body.results[0].year);
      var movieActors = [];
      for (const actor of res.body.results[0].principals) {
        const id = actor.id.split("/")[2];
        var nreq = unirest("GET", "https://imdb8.p.rapidapi.com/actors/get-bio");
        nreq.query({
          "nconst": id
        });

        nreq.headers({
          "x-rapidapi-key": "e7d1372ca8msh640de66bbef1f29p158dc7jsn87b53fa8b82a",
          "x-rapidapi-host": "imdb8.p.rapidapi.com",
          "useQueryString": true
        });

        nreq.end(function (res) {
          if (res.error) throw new Error(res.error);
          const yr = parseInt(res.body.birthDate.split("-")[0])
          const yob = res.body.birthDate.split("-")[0]
          const age = movieYear - yr;
          movieActors.push({ actor: actor.name, id: id, yob: yob, age: age, imageurl: res.body.image.url});
          currentComponent.setState({ movieActors: movieActors, isLoading: false });
        });
      }
    });
  }

  renderMovie() {
    if (this.state.movieData) {
      const imgUrl = this.state.movieData.image.url;
      const width = this.state.movieData.image.width/3 + "px";
      const height = this.state.movieData.image.height/3 + "px";

      console.log(width)
      console.log(height)

    return (
      <div>

      <Card shadow={0} style={{height: "500px", width: "50%"}} >
    <CardTitle expand style={{color: '#fff', background: 'url('+imgUrl+') center / cover'}}><h2><b>"{this.state.movieData.title}"</b></h2></CardTitle>
    <CardText>
     <h3>{this.state.movieData.year}</h3>
    </CardText>
</Card>
      </div>

      

    );
    } else {
      return <></>
    }
  }

  renderActors() {
    var el = []
    for (const actor of this.state.movieActors) {
      const d = "Year Of Birth: " + actor.yob + " | Age in movie: " + actor.age;
      if (actor.age === 0) continue;
      const a = 'url('+actor.imageurl+') center / cover'
      el.push(
        <Card shadow={0} style={{margin: '20px', width: '256px', height: '256px', background: 'url('+actor.imageurl+') center / cover'}}>
    <CardTitle expand />
    <CardActions style={{height: '52px', padding: '5px', background: 'rgba(0,0,0,0.7)'}}>
        <span style={{color: '#fff', fontSize: '14px', fontWeight: '500'}}>
          {actor.actor}<br/>
            {d}
        </span>
    </CardActions>
</Card>
        
        
        )
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
            <b>Movie Title</b>: <br />
            <input type="text" value={this.state.movie} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Search" />
        </form>

        {this.state.isLoading ? <div>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div> : <></>}

        {this.renderMovie()}
 

        <div>
          <List style={{ width: '350px' }}>
            {this.renderActors()}
          </List>
        </div>

        <footer align="center" style={{ background: "clear" }}>
          <small >© Copyright | All rights reserved </small>
        </footer>
      </div>
    );
  }
}

export default Home;
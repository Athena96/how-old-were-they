import React, { Component } from 'react';
import { Button, CardActions, CardTitle, CardText, Card } from 'react-mdl';
import Spinner from 'react-bootstrap/Spinner'
import '../App.css';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = { isLoading: false, videoResults: [], videoResultsMap: {}, videoSearch: '', videoActorResults: [] };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleChange(event) {
    this.setState({ videoSearch: event.target.value });
  }

  handleSubmit(event) {
    if (this.state.videoSearch === '') {
      return
    }
    this.setState({ isLoading: true });
    let currentComponent = this;
    event.preventDefault();

    var unirest = require("unirest");
    var req = unirest("GET", "https://imdb8.p.rapidapi.com/title/find");
    req.query({
      "q": this.state.videoSearch
    });
    console.log("API_KEY: " + process.env.API_KEY);

    req.headers({
      "x-rapidapi-key": "e7d1372ca8msh640de66bbef1f29p158dc7jsn87b53fa8b82a",
      "x-rapidapi-host": "imdb8.p.rapidapi.com",
      "useQueryString": true
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);
      var queryResults = res.body.results.filter(function(video) {
        if (video.titleType) {
          return video.titleType.includes('tv') || video.titleType.includes('movie');
        }
      });

      currentComponent.setState({videoResultsMap: {} });
      var videoResMp = {}
      for (var ob of queryResults) {
        videoResMp[ob.id] = ob;
      }
      currentComponent.setState({videoResultsMap: videoResMp });

      currentComponent.setState({ videoResults: queryResults, isLoading: false });

    });
  }

  handleSelect(e) {
    let currentComponent = this;
    this.setState({videoActorResults: this.state.videoResultsMap[e.target.id].principals,
    videoResults: [this.state.videoResultsMap[e.target.id]] }); 

    const movieYear = parseInt(this.state.videoResultsMap[e.target.id].year);
    var movieActors = [];
    for (const actor of this.state.videoResultsMap[e.target.id].principals) {
      const id = actor.id.split("/")[2];
      var unirest = require("unirest");
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
        if (res && res.hasOwnProperty('body') && res.body.hasOwnProperty('birthDate')) {
          const yr = parseInt(res.body.birthDate.split("-")[0])
          const yob = res.body.birthDate.split("-")[0]
          const age = movieYear - yr;
          movieActors.push({ actor: actor.name, id: id, yob: yob, age: age, imageurl: res.body.image.url });
          currentComponent.setState({ videoActorResults: movieActors, isLoading: false });
        }

      });
    }

  }

  renderVideoResults() {
    if (this.state.videoResults.length !== 0 ) {
      var r = [];
      for (const video of this.state.videoResults) {
        if (video && video.hasOwnProperty('image')) {
          const imgUrl = video.image.url;
          r.push(
              <Card shadow={0} style={{ margin: '10px', height: '550px'}} >
                <CardTitle expand style={{ color: '#fff', background: 'url(' + imgUrl + ') center / cover' }}></CardTitle>
                <CardText>

                <Button id={video.id} onClick={this.handleSelect} style={{color: 'blue'}}>"{video.title}" | {video.year}</Button>

                </CardText>
              </Card>
          );
        }
      }

      return r;

    } else {
      return <></>
    }
  }

  renderActors() {
    var el = []
    for (const actor of this.state.videoActorResults) {
      const d = "Year Of Birth: " + actor.yob + " | Age in movie: " + actor.age;
      if (actor.age === 0) continue;
      el.push(
        <Card shadow={0} style={{ margin: '10px', width: '256px', height: '256px', background: 'url(' + actor.imageurl + ') center / cover' }}>
          <CardTitle expand />
          <CardActions style={{ height: '52px', padding: '5px', background: 'rgba(0,0,0,0.7)' }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
              {actor.actor}<br />
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
            <b>Movie or TV show Title</b>: <br />
            <input type="text" value={this.state.videoSearch} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Search" />
        </form>

        {this.state.isLoading ? <div>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div> : <></>}

        {this.renderVideoResults()}

        <hr />

        {this.state.videoActorResults.length !== 0 ? 
          this.renderActors()
         : <></>}

        <footer align="center" style={{ background: "clear" }}>
          <small >© Copyright | All rights reserved </small>
        </footer>
      </div>
    );
  }
}

export default Home;
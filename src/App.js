import React, {Component} from 'react';
import logo from './logo.svg';
import Header from './js/header';
import Converter from './js/converter';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <Converter/>
            </div>
        );
    }
}

export default App;

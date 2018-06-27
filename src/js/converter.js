import React, {Component} from 'react';

class Converter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valueBefore: "",
            valueAfter: "",
            currencyBefore: "PLN",
            currencyAfter: "USD",
            currency: [],

        }
    }

    componentDidMount() {
        fetch('http://api.nbp.pl/api/exchangerates/tables/A/?format=json')
            .then(resp => {
                if (resp.ok) {
                    return resp.json();
                } else {
                    throw new Error("Błąd sieci!")
                }
            }).then(data => {
            let currency1 = [];
            for (let i = 0; i < data[0].rates.length; i++) {
                currency1.push(data[0].rates[i].code);
            }
            currency1.push("PLN");
            currency1.sort();
            this.setState({
                currency: currency1
            })
        }).catch(err => {
            console.log(err);
        });
    }

    valueBeforeHandler = (event) => {
        if (event.currentTarget.value < 0) {
            this.setState({
                valueBefore: ""
            })
        } else {
            this.setState({
                valueBefore: event.currentTarget.value
            })
        }
    };

    currencyBeforeHandler = (event) => {
        this.setState({
            currencyBefore: event.currentTarget.value
        })
    };

    valueAfterHandler = (event) => {
        this.setState({
            valueAfter: event.currentTarget.value
        })
    };

    currencyAfterHandler = (event) => {
        this.setState({
            currencyAfter: event.currentTarget.value
        })
    };

    convert = (event) => {
        event.preventDefault();

        if (this.state.currencyBefore === "PLN" && this.state.currencyAfter !== "PLN") {
            fetch("http://api.nbp.pl/api/exchangerates/rates/A/" + this.state.currencyAfter + "/?format=json")
                .then(resp => {
                    if (resp.ok) {
                        return resp.json();
                    } else {
                        throw new Error("Błąd sieci!")
                    }
                }).then(dataAfter => {
                this.setState({
                    valueAfter: Number((this.state.valueBefore / dataAfter.rates[0].mid).toFixed(2))
                })
                // console.log(this.state.valueBefore * data.rates[0].mid);
            }).catch(err => {
                console.log(err);
            });

        } else if (this.state.currencyAfter === "PLN" && this.state.currencyBefore !== "PLN") {
            fetch("http://api.nbp.pl/api/exchangerates/rates/A/" + this.state.currencyBefore + "/?format=json")
                .then(resp => {
                    if (resp.ok) {
                        return resp.json();
                    } else {
                        throw new Error("Błąd sieci!")
                    }
                }).then(dataBefore => {
                this.setState({
                    valueAfter: Number((this.state.valueBefore * dataBefore.rates[0].mid).toFixed(2))
                })
            }).catch(err => {
                console.log(err);
            });

        } else if (this.state.currencyBefore === "PLN" && this.state.currencyAfter === "PLN") {
            this.setState({
                valueAfter: Number(this.state.valueBefore).toFixed(2)
            })

        } else {
            fetch("http://api.nbp.pl/api/exchangerates/rates/A/" + this.state.currencyBefore + "/?format=json")
                .then(resp => {
                    if (resp.ok) {
                        return resp.json();
                    } else {
                        throw new Error("Błąd sieci!")
                    }
                }).then(dataBefore => {
                fetch("http://api.nbp.pl/api/exchangerates/rates/A/" + this.state.currencyAfter + "/?format=json")
                    .then(resp => {
                        if (resp.ok) {
                            return resp.json();
                        } else {
                            throw new Error("Błąd sieci!")
                        }
                    }).then(dataAfter => {
                    this.setState({
                        valueAfter: Number((this.state.valueBefore * dataBefore.rates[0].mid / dataAfter.rates[0].mid).toFixed(2))
                    });
                }).catch(err => {
                    console.log(err);
                });

            }).catch(err => {
                console.log(err);
            });
        }
    };

    render() {
        return (
            <form className={"converter"}>
                <input className={"input"} onChange={this.valueBeforeHandler} type="number"
                       value={this.state.valueBefore} placeholder={"enter a value"}/>
                <select className={"select"} onChange={this.currencyBeforeHandler} name="" id=""
                        value={this.state.currencyBefore}>
                    {this.state.currency.map((element) => {
                        return <option key={element} className={"option"} value={element}>{element}</option>
                    })}
                </select>
                <span style={{margin: "0px 20px"}}>to</span>
                <select className={"select"} onChange={this.currencyAfterHandler} name="" id=""
                        value={this.state.currencyAfter}>
                    {this.state.currency.map((element) => {
                        return <option key={element} className={"option"} value={element}>{element}</option>
                    })}
                </select>
                <button onClick={this.convert} className={"button"}>Convert</button>
                <br/>
                <input className={"input"} style={{width: "388px"}} onChange={this.valueAfterHandler} type="number"
                       value={this.state.valueAfter} disabled/>
            </form>
        )
    }
}

export default Converter;
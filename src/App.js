import React, { Component } from "react";
import Input from '@material-ui/core/Input';
import NativeSelect from '@material-ui/core/NativeSelect';
import { withStyles } from '@material-ui/core/styles';
import './index.css';

const currency = {
    UAH: 1,
    USD: 0.039,
    EUR: 0.035,
};

const arr = [];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
            digCur: '',
            firstCurrency: 'USD',
            secondCurrency: "UAH",
            error: null,
            isLoaded: false,
            items: null,
            items1:null,
            items2: null,

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.showMoney = this.showMoney.bind(this);
        this.toMoney = this.toMoney.bind(this);
        this.getResult = this.getResult.bind(this);
        this.handreversClick = this.handreversClick.bind(this);
    }

    handleChange(e) {
        this.setState({ digCur: e.target.value });
    }
    //Проверка и валидация формы ввода

    handleBlur (e) {
        if (e.currentTarget.value === '0') e.currentTarget.value = '1'
    }

    handleKeypress (e) {
        const characterCode = e.key;
        if (characterCode === 'Backspace')
            return
        const characterNumber = Number(characterCode);
        if (characterNumber >= 0 && characterNumber <= 9) {
            if (e.currentTarget.value && e.currentTarget.value.length) {
                return
            } else if (characterNumber === 0) {
                e.preventDefault()
            }
        } else {
            e.preventDefault()
        }
    }

    showMoney (e) {
        this.setState ({
            firstCurrency: e.target.value
        })
    }

    toMoney (e) {
        this.setState ({
            secondCurrency: e.target.value
        })
    }

    getResult() {
        const {
            digCur,
            firstCurrency,
            secondCurrency
        } = this.state;

        return (digCur / currency[firstCurrency] * currency[secondCurrency]).toFixed(2);

    }

    handreversClick() {
        this.setState({
            firstCurrency: this.state.secondCurrency,
            secondCurrency: this.state.firstCurrency,
        });
    }
    componentDidMount() {                                                                   /////
        fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
            .then(
                res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result[26].rate,
                        items1: result[33].rate
                    });
                    currency.USD = 1 / result[26].rate;
                    currency.EUR = 1 / result[32].rate;
                    currency.RUB = 1 / result[18].rate;
                },

                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            );

    }


    /////

    render() {
        const { classes } = this.props;
        const result = this.getResult();

        return (
            <div className="Converter">
                <Input
                    className={classes.input}
                    type="number"
                    value={this.state.digCur}
                    name="digNamb"
                    placeholder="Enter amount"
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeypress}
                    onBlur={this.handleBlur}
                />

                <NativeSelect
                    className={classes.select1}
                    value={this.state.firstCurrency}
                    onChange={this.showMoney}
                    name="currMoney"
                >
                    {
                        Object.keys(currency)
                            .map(key => <option key={key + 'first'} value={key}>{key}</option>)
                    }
                </NativeSelect>

                <h1 className='arrow'
                    onClick={this.handreversClick}>&#8594;</h1>
                <h1 className='arrow1'>&#8595;</h1>

                <NativeSelect
                    className={classes.select2}
                    value={this.state.secondCurrency}
                    onChange={this.toMoney}
                    name="totalMoney"
                >
                    {
                        Object.keys(currency)
                            .map(key => <option key={key + 'second'} value={key}>{key}</option>)
                    }
                </NativeSelect>
                <h2 className='result'>{result}</h2>

            </div>
        );
    }
}

const styles = {
    select1: {
        color: '#0000FF',
        backgroundColor: '#FFFFFF',
        marginLeft: '10px',
        width: '210px',
        height: '50px',
        fontSize: '25px',
        marginTop: '70px',
        borderRadius: '5px',
        fontWeight: 'bold'

    },
    select2: {
        color: '#0000FF',
        backgroundColor: '#FFFFFF',
        width: '210px',
        height: '50px',
        fontSize: '25px',
        marginTop: '70px',
        borderRadius: '5px',
        fontWeight: 'bold'

    },
    button: {
        backgroundColor: '#FFA500',
        marginLeft: '10px',
        width: '210px',
        height: '50px',
        fontSize: '25px',
        padding: 0,
        marginBottom: '10px',
        borderRadius: '5px'


    },
    input: {
        color: '#0000FF',
        backgroundColor: '#FFFFFF',
        marginLeft: '40px',
        width: '210px',
        height: '50px',
        fontSize: '25px',
        borderRadius: '5px',
        border: '2px',
        borderColor:'#191970',
        fontWeight: 'bold'

    },

    '@media (max-width: 1000px)': {
        button: {
            marginBottom: '0',
            marginLeft: '45px',
            marginTop: '20px',


        },
        input: {
            marginTop: '30px',
            marginLeft: '45px',
        },
        select1: {
            marginLeft: '45px',
            marginTop: '20px',

        },
        select2: {
            marginLeft: '45px',
            marginTop: '0',
        },

    },

};

export default withStyles(styles)(App);
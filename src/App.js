import React, { Component } from 'react';
import './App.css';

import IconexConnect from './IconexConnect';
import {
  IconConverter
} from 'icon-sdk-js'
import SDK from './SDK.js';


import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles(theme => ({
  root: {
    background: props =>
      props.color === 'red'
        ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: props =>
      props.color === 'red'
        ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
        : '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: 8,
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  // textField: {
  //   marginLeft: theme.spacing(1),
  //   marginRight: theme.spacing(1),
  // },

}));

function MyButton(props) {
  const { color, ...other } = props;
  const classes = useStyles(props);
  return <Button className={classes.root} {...other} />;
}

MyButton.propTypes = {
  color: PropTypes.string.isRequired,
};

function hexToString (hex) {
  var string = '';
  for (var i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return string;
}

export default class App extends Component {
  state = {
    login: false,
    txevent: false,
    curmsg: '',
    myAddress: '',
    msg: ''
  }



  funcLogin = async (e) => {
    const myAddress = await IconexConnect.getAddress()
    this.setState({
      login: true,
      myAddress: myAddress
    })

    const msg = await
    SDK.iconService.call(
      SDK.callBuild({
        from: this.state.myAddress,
        methodName: 'read_happy_virus',
        params: {
        },
        to: window.CONTRACT_ADDRESS,
      })
    ).execute()

  const buf = hexToString(msg)
  console.log(msg, buf)
  this.setState({
    msg: buf
  })

  }

  funcUpdate = (e) => {
    this.setState({
      curmsg: e.target.value
    })
  }

  funcTx = async () => {
    const { sendTxBuild } = SDK


    const txObj = sendTxBuild({
      from: this.state.myAddress,
      to: window.CONTRACT_ADDRESS,
      methodName: 'put_happy_virus',
      params: {
        msg: IconConverter.fromUtf8(this.state.curmsg), 
      },
    })
    console.log(IconConverter.fromUtf8(this.state.curmsg))
    const tx = await IconexConnect.sendTransaction(txObj)
    if (tx){
      alert("전송하신 <" + this.state.curmsg + "> 메세지가 다음 사람에게 전달됩니다. XD ")
    }
    console.log("tx", tx, typeof(tx))
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
        <h1><a href="/">Love, Love, Love</a></h1>
          {
            !this.state.login ? (
              <>
                
                <React.Fragment>
                  <MyButton color="red" onClick={this.funcLogin}>지갑 연동</MyButton>
                </React.Fragment>
             
              </>
            ) : (
                <>{
                  this.state.txevent ? (
                    <>

                        

                    </>
                  ) : (
                      <>
 
                          <Card className={useStyles.card} style={{backgroundColor:'mediumslateblue'}}>
                            <CardActionArea>
                              <CardMedia
                                className={useStyles.media}

                                title="Contemplative Reptile"
                              />
                              <CardContent>
                                <Typography gutterBottom variant="h3" component="h2">
                                  <h2><a>{this.state.msg}</a></h2>
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                            <CardActions>

                              <TextField
                                style={{ width: 600 }}
                                id="outlined-name"
                                label="Love Msg To Next"
                                className={useStyles.textField}
                                value={this.state.curmsg}
                                onChange={this.funcUpdate}

                                // value={useStyles.values.name}
                                // onChange={useStyles.handleChange('name')}
                                margin="normal"
                                variant="outlined"
                              />
                              <MyButton onClick={this.funcTx} color="red" style={{ height: 62, marginTop: 15, width: 150 }}>
                                Send
                              </MyButton>
                            </CardActions>
                          </Card>

                      </>
                    )
                }
                </>
              )
          }

        </header>
      </div>
    );
  }

}




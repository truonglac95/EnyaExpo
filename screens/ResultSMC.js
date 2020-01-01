import React from 'react';
import { connect } from 'react-redux';

import { StyleSheet, Text, ScrollView, View, Dimensions, 
  ActivityIndicator } from 'react-native';

import mS from '../constants/masterStyle';

class ResultSMC extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text style={mS.screenTitle}>{'SMC Result'}</Text>),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {

    super(props);
  
    const { answers, smc } = this.props.answer;

    this.state = {
      result: (smc.result || 0.0),
      binary_1: (answers.binary_1 || 0),
      binary_2: (answers.binary_2 || 0),
      birthyear: (answers.birthyear || 0),
      gender: (answers.gender || 0),
      country: (answers.country || 0)
    };

  }

UNSAFE_componentWillReceiveProps(nextProps) {

    const { answers: nextAnswers, smc: nextSMC } = nextProps.answer;

    this.setState({
      result: (nextSMC.result || 0.0),
      binary_1: (nextAnswers.binary_1 || 0),
      binary_2: (nextAnswers.binary_2 || 0),
      birthyear: (nextAnswers.birthyear || 0),
      gender: (nextAnswers.gender || 0),
      country: (nextAnswers.country || 0)
    });

  }

  render() {
    
    const { result, birthyear, gender, country, binary_1, binary_2 } = this.state;

    //so we do not briefly show the wrong (old) result
    if (this.props.answer.loading) {
       return (
        <View style={styles.loadingContainer}>
         <ActivityIndicator size="large" color='#33337F' />
       </View>);
     }

    var score = parseFloat(result).toFixed(1);
    var relativeR = score / 0.8;
    
    var strMain = '';
    var strMean = '';

    if (score <= 1) {
      strMain = 'low'
    }
    else if (score <= 3) { 
      strMain = 'average'
    }
    else { 
      strMain = 'high'
    }

    if (relativeR <= 0.8) { 
      strMean = 'Given your reduced score, lorem ipsum dolor sit amet, \
consectetur adipiscing elit, sed do eiusmod tempor.'
    }
    else if ((relativeR > 0.8) && (relativeR < 1.2)) { 
      strMean = 'Given your average score, lorem ipsum dolor sit amet, \
consectetur adipiscing elit, sed do eiusmod tempor.'
    }
    else { 
      strMean = 'Given your elevated score, lorem ipsum dolor sit amet, \
consectetur adipiscing elit, sed do eiusmod tempor.'
    }

    return (

<View style={{flex: 1}}>

<ScrollView 
  style={styles.containerReport} 
  contentContainerStyle={{flexGrow: 1}}
  showsVerticalScrollIndicator={false}
>

<View style={styles.rowTop}>

<Text style={styles.text}>
  <Text style={{fontSize: 33, fontWeight: 'bold'}}>{score}%</Text>
</Text>

<Text style={styles.text}>{'Your score is '}
  <Text style={{fontWeight: 'bold'}}>{strMain}</Text>
</Text>

</View>

{/*Compare to others*/}
<View style={styles.row}>
<Text style={styles.title}>{'Compared to others...'}</Text>
<Text style={styles.text}>{'Your score of '}
  <Text style={{fontWeight: 'bold'}}>{score}%</Text>
{' is '}
  <Text style={{fontWeight: 'bold'}}>{score/2}</Text>
{' times higher than other people of your age. Lorem ipsum dolor sit amet, \
consectetur adipiscing elit, sed do eiusmod tempor.'}
</Text>
</View>

{/*What does this mean for me?*/}
<View style={styles.row}>
<Text style={styles.title}>{'What does this mean for me?'}</Text>
<Text style={styles.text}>{'Your relative risk is '}
  <Text style={{fontWeight: 'bold'}}>{score/2}</Text>{'. '}{strMean}
</Text>
</View>

{/*Of course, you can also process answers locally...*/}
<View style={styles.row}>
<Text style={styles.title}>{'Other factors'}</Text>
<Text style={styles.text}>{'Based on your birthyear ('}
<Text style={{fontWeight: 'bold'}}>{birthyear}</Text>
{'), your gender ('}
<Text style={{fontWeight: 'bold'}}>{gender}</Text>
{'), where you live ('}
<Text style={{fontWeight: 'bold'}}>{country}</Text>
{'), and your BINARY_1 answer ('}
<Text style={{fontWeight: 'bold'}}>{binary_1}</Text>
{'), we recommend lorem ipsum dolor sit amet, \
consectetur adipiscing elit, sed do eiusmod tempor.'}
</Text>
</View>

</ScrollView>

</View>);}}

const styles = StyleSheet.create({
  loadingContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
   },
  containerReport: {
    left: 0,
    top: 0,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 5,
    marginBottom: 10,
  },
  subHead: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    marginTop: 10,
    lineHeight: 20,
  },
  text: {
    fontSize: 15,
    marginRight: 5,
  },
  row: {
    marginTop:10, 
    marginBottom:20,
  },
  rowTop: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
});

const mapStateToProps = state => ({
  answer: state.answer,
  result: state.result,
});

export default connect(mapStateToProps)(ResultSMC);
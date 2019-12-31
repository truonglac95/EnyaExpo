import React from 'react';
import { connect } from 'react-redux';

// UI
import { StyleSheet, Text, ScrollView, View, Dimensions, ActivityIndicator } from 'react-native';
import colors from '../constants/Colors';

class ResultSMC extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text 
        style={{
          fontSize: 19,
          color: '#33337F',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          alignSelf: 'center',
        }}>
          {'SMC Result'}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {

    super(props);
  
    const { answers, smc } = this.props.answer;

    this.state = {
      result: (smc.result || 0.0),
      binary_2: (answers.binary_2 || 0),
      binary_1: (answers.binary_1 || 0),
      birthyear: (answers.birthyear || 0),
      gender: (answers.gender || 0),
      country: (answers.country || 0)
    };

  }

UNSAFE_componentWillReceiveProps(nextProps) {

    const { answers: nextAnswers, smc: nextSMC } = nextProps.answer;

    this.setState({
      result: (nextSMC.result || 0.0),
      binary_2: (nextAnswers.binary_2 || 0),
      binary_1: (nextAnswers.binary_1 || 0),
      birthyear: (nextAnswers.birthyear || 0),
      gender: (nextAnswers.gender || 0),
      country: (nextAnswers.country || 0)
    });

  }

  render() {
    
    const { result, binary_2, binary_1, birthyear, gender, country } = this.state;

    //so we do not briefly show the wrong (old) result
    if (this.props.answer.loading) {
       return (
        <View style={styles.loadingContainer}>
         <ActivityIndicator size="large" color='#33337F' />
       </View>);
     }

    var score = parseFloat(result).toFixed(2);
    var strMain = '';
    var strMean = '';

    if (score <= 3) {
      strMain = 'low.'
    }
    else if (score <= 8) { 
      strMain = 'median.'
    }
    else { 
      strMain = 'high.'
    }

    if (score/2 <= 2) { 
      strMean = 'You are less likely to get sick than ordinary people.'
    }
    else { 
      strMean = 'You are more likely to get sick than ordinary people.'
    }

    return (

<View style={{flex: 1}}>

<ScrollView 
  style={styles.containerReport} 
  contentContainerStyle={{ flexGrow: 1 }}
  showsVerticalScrollIndicator={false}
>

<View style={styles.rowTop}>

<Text style={styles.text}>
  <Text style={{fontSize: 33, fontWeight: 'bold'}}>{score}%</Text>
</Text>

<Text style={styles.text}>{'Your risk is '}
  <Text style={{fontWeight: 'bold'}}>{` `}{strMain}{'\n'}</Text>
</Text>

</View>

{/*Compare to others?*/}
<View style={styles.row}>
<Text style={styles.title}>{'Compare to others'}</Text>
<Text style={styles.text}>{'You have a '}
  <Text style={{fontWeight: 'bold'}}>{score}%</Text>{' risk in next 20 years. Your risk is '}
  <Text style={{fontWeight: 'bold'}}>{score/2}</Text>{' times higher than a normal person of your age.'}
</Text>
</View>

{/*What does this mean for me?*/}
<View style={styles.row}>
<Text style={styles.title}>{'What does this mean for me?'}</Text>
<Text style={styles.text}>{'Your relative risk is '}
  <Text style={{fontWeight: 'bold'}}>{score/2}</Text>{'. '}{strMean}
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
    color: colors.BD_main_text,
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 5,
    marginBottom: 10,
  },
  subHead: {
    color: colors.BD_main_text,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    marginTop: 10,
    lineHeight: 20,
  },
  text: {
    color: colors.BD_main_text,
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
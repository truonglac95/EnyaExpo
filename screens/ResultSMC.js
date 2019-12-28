import React from 'react';
import { connect } from 'react-redux';

// UI
import { StyleSheet, Text, ScrollView, View, Dimensions, ActivityIndicator } from 'react-native';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';

class ResultSMC extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text 
        style={{
          fontSize: 19,
          color: colors.headerFontColor,
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          alignSelf: 'center',
        }}>
          {'Secure Computation Result'}
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
      hdlc: (answers.hdlc || 0),
      diabetes: (answers.diabetes || 0),
      smoking: (answers.smoking || 0),
      birthyear: (answers.birthyear || 0),
      gender: (answers.gender || 0),
    };

  }

UNSAFE_componentWillReceiveProps(nextProps) {

    const { answers: nextAnswers, smc: nextSMC } = nextProps.answer;

    this.setState({
      result: (nextSMC.result || 0.0),
      hdlc: (nextAnswers.hdlc || 0),
      diabetes: (nextAnswers.diabetes || 0),
      smoking: (nextAnswers.smoking || 0),
      birthyear: (nextAnswers.birthyear || 0),
      gender: (nextAnswers.gender || 0),
    });

  }

  render() {
    
    const { result, hdlc, diabetes, smoking, birthyear, gender } = this.state;

    //so we do not briefly show the wrong (old) result
    if (this.props.answer.loading) {
       return (
        <View style={styles.loadingContainer}>
         <ActivityIndicator size="large" color='#33337F' />
       </View>);
     }

    var score = parseFloat(result).toFixed(1);
    var strHDL = '';
    var strMain = '';

    if (score <= 3) {
      strMain = 'result_main_low low low low low.'
    }
    else if (score <= 8) { 
      strMain = 'result_main_med med med med med.'
    }
    else { 
      strMain = 'result_main_high high high high high.'
    }

    if (hdlc <= 3) { 
      strHDL = 'result_hdl_low low low low low.'
    }
    else if (hdlc <= 8) { 
      strHDL = 'result_hdl_norm low low low low.'
    }
    else { 
      strHDL = 'result_hdl_hig low low low low.'
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

<Text style={styles.text}>{'Header'}
  <Text style={{fontWeight: 'bold'}}>{` `}{strMain}{'\n'}</Text>
</Text>

</View>

{/*Compare this to others?*/}
<View style={styles.row}>
<Text style={styles.title}>{'What does this mean for me?'}</Text>
<Text style={styles.text}>{'result_FRS_you_have'}
  <Text style={{fontWeight: 'bold'}}>{score}%</Text>{'result_FRS_10y'}{strMain}
</Text>
</View>

{/*What does this mean for me?*/}
<View style={styles.row}>
<Text style={styles.title}>{'What does this mean for me?'}</Text>
<Text style={styles.text}>{'result_FRS_you_have'}
  <Text style={{fontWeight: 'bold'}}>{score}%</Text>{'result_FRS_10y'}{strHDL}
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
import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, ScrollView, View, Dimensions, ActivityIndicator } from 'react-native';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';

class ResultFRSScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text 
        style={{
          fontSize: 19,
          color: colors.headerFontColor,
          fontFamily: colors.headerFont,
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          alignSelf: 'center',
        }}>
          {i18n.t('result_title')}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {

    super(props);
  
    const { answers, frs } = this.props.answer;
    const { localResult } = this.props.result;

    this.state = {

      frsScore_ab: (frs.frsScore_ab || 0.0),
      frsScore_r: (frs.frsScore_r || 0.0),
      frsLabel_gene: (frs.frsLabel_gene || 'unknown'),
      frsLabel_lifestyle: (frs.frsLabel_lifestyle || 'unknown'),

      hdlc: (answers.hdlc || 0),
      cholesterol: (answers.cholesterol || 0),
      bloodpressure: (answers.bloodpressure || 0),
      diabetes: (answers.diabetes || 0),
      smoking: (answers.smoking || 0),
      birthyear: (answers.birthyear || 0),
      gender: (answers.gender || 0),

      gene_rr: (localResult.gene_rr || 0), //e.g. 1.8 - integer zero denotes no data
      dnaStatus: (localResult.r_state || 0), //result type

    };

  }

UNSAFE_componentWillReceiveProps(nextProps) {

    const { answers: nextAnswers, frs: nextFrs } = nextProps.answer;
    const { localResult: nextLocalResult } = nextProps.result;

    this.setState({

      frsScore_ab: (nextFrs.frsScore_ab|| 0.0),
      frsScore_r: (nextFrs.frsScore_r|| 0.0),
      frsLabel_gene: (nextFrs.frsLabel_gene || 'unknown'),
      frsLabel_lifestyle: (nextFrs.frsLabel_lifestyle || 'unknown'),

      hdlc: (nextAnswers.hdlc || 0),
      cholesterol: (nextAnswers.cholesterol || 0),
      bloodpressure: (nextAnswers.bloodpressure || 0),
      diabetes: (nextAnswers.diabetes || 0),
      smoking: (nextAnswers.smoking || 0),
      birthyear: (nextAnswers.birthyear || 0),
      gender: (nextAnswers.gender || 0),

      gene_rr: (nextLocalResult.gene_rr || 0), //e.g. 1.8 - integer zero denotes no data
      dnaStatus: (nextLocalResult.r_state || 0), //result type

    });

  }

  render() {
    
    const { frsScore_ab, frsScore_r, frsLabel_gene, frsLabel_lifestyle, hdlc, cholesterol, 
            bloodpressure, diabetes, smoking, birthyear, gender, dnaStatus, gene_rr } = this.state;

    //so we do not briefly show the wrong (old) result
    if (this.props.answer.loading) {
       return (
        <View style={styles.loadingContainer}>
         <ActivityIndicator size="large" color='#33337F' />
       </View>);
     }

    var haveDetailedDNA = false;
    var totalScore_ab = 0.0;
    var totalScore_r = 0.0;
    var frsLabel = '';
    var varBPtext ='Unknown';
    var varCholesterol = 'Unknown';
    var varHDL = 'Unknown';
    
    var totalScoreF = 0.0;

    if ( dnaStatus >= 4 ) {
      haveDetailedDNA = true;
      totalScore_ab = parseFloat(frsScore_ab * gene_rr).toFixed(1);
      totalScore_r  = parseFloat(frsScore_r  * gene_rr).toFixed(1);
      frsLabel = frsLabel_gene;
    }
    else {
      totalScore_ab = parseFloat(frsScore_ab).toFixed(1);
      totalScore_r  = parseFloat(frsScore_r ).toFixed(1);
      frsLabel = frsLabel_lifestyle;
    }

    //"first let's compute the age"
    var age = (new Date().getFullYear()) - birthyear;
    
    //the 'what does this mean for me section'

    if      (bloodpressure <  2 ){ varBPtext = i18n.t('result_bp_low'); } 
    else if (bloodpressure <  6 ){ varBPtext = i18n.t('result_bp_elv'); } 
    else if (bloodpressure >= 6 ){ varBPtext = i18n.t('result_bp_hig'); }

    if      (cholesterol <= 5) { varCholesterol = i18n.t('result_cholesterol_low'); }
    else if (cholesterol <= 8) { varCholesterol = i18n.t('result_cholesterol_bor'); } 
    else                       { varCholesterol = i18n.t('result_cholesterol_hig'); }
    
    if      (varHDL <= 3) { varHDL = i18n.t('result_hdl_low' ); }
    else if (varHDL <= 8) { varHDL = i18n.t('result_hdl_norm'); }
    else                  { varHDL = i18n.t('result_hdl_hig' ); }

    var general_note = i18n.t('result_general_note');

    return (

<View style={{flex: 1}}>

<ScrollView 
  style={styles.containerReport} 
  contentContainerStyle={{ flexGrow: 1 }}
  showsVerticalScrollIndicator={false}
>

<View style={styles.rowTop}>

<Text style={styles.text}><Text style={{fontSize: 33, fontWeight: 'bold'}}>{totalScore_ab}%</Text></Text>

{frsLabel == 'low' &&
  <Text style={styles.text}>{i18n.t('result_FRS_risk_is')}<Text style={{fontWeight: 'bold'}}>{` `}{i18n.t('global_low')}{'\n'}</Text></Text>
}
{frsLabel == 'moderate' &&
  <Text style={styles.text}>{i18n.t('result_FRS_risk_is')}<Text style={{fontWeight: 'bold'}}>{` `}{i18n.t('global_moderate')}{'\n'}</Text></Text>
}
{frsLabel == 'borderline' &&
  <Text style={styles.text}>{i18n.t('result_FRS_risk_is')}<Text style={{fontWeight: 'bold'}}>{` `}{i18n.t('global_borderline')}{'\n'}</Text></Text>
}
{frsLabel == 'elevated' &&
  <Text style={styles.text}>{i18n.t('result_FRS_risk_is')}<Text style={{fontWeight: 'bold'}}>{` `}{i18n.t('global_elevated')}{'\n'}</Text></Text>
}
{frsLabel == 'high' &&
  <Text style={styles.text}>{i18n.t('result_FRS_risk_is')}<Text style={{fontWeight: 'bold'}}>{` `}{i18n.t('global_high')}{'\n'}</Text></Text>
}

{!!haveDetailedDNA &&
  <Text style={[styles.text, {lineHeight: 20, textAlign: 'center'}]}>{i18n.t('result_FRS_include')}</Text>
}
{!haveDetailedDNA &&
  <Text style={[styles.text, {lineHeight: 20, textAlign: 'center'}]}>{i18n.t('result_FRS_exclude')}</Text>
}
</View>

{/*What does this mean for me?*/}
<View style={styles.row}>

<Text style={styles.title}>{i18n.t('result_meaning')}</Text>

{/* if we have genetic report */}
{!!haveDetailedDNA && (totalScore_r > 1.2) && <Text style={[styles.text, {lineHeight: 20}]}>
{i18n.t('result_FRS_you_have')}<Text style={{fontWeight: 'bold', lineHeight: 20}}>{totalScore_ab}%</Text>{i18n.t('result_FRS_10y')} {i18n.t('result_FRS_higher1')}
<Text style={{fontWeight: 'bold', lineHeight: 20}}>{totalScore_r}</Text>{i18n.t('result_FRS_higher2')}</Text>
}

{!!haveDetailedDNA && (totalScore_r <= 1.2) && (totalScore_r >= 0.9) && <Text style={[styles.text, {lineHeight: 20}]}>
{i18n.t('result_FRS_you_have')}<Text style={{fontWeight: 'bold', lineHeight: 20}}>{totalScore_ab}%</Text>{i18n.t('result_FRS_10y')}
{i18n.t('result_FRS_equal')}</Text>
}

{!!haveDetailedDNA && (totalScore_r < 0.9) && <Text style={[styles.text, {lineHeight: 20}]}>
{i18n.t('result_FRS_you_have')}<Text style={{fontWeight: 'bold', lineHeight: 20}}>{totalScore_ab}%</Text>{i18n.t('result_FRS_10y')} {i18n.t('result_FRS_lower1')}
<Text style={{fontWeight: 'bold', lineHeight: 20}}>{parseFloat((1-totalScore_r)*100).toFixed(1)}</Text>{i18n.t('result_FRS_lower2')}</Text>
}

{!!haveDetailedDNA && (frsLabel == 'borderline') && <Text style={[styles.text, {lineHeight: 20}]}>
{i18n.t('result_FRS_borderline_DNA')}</Text>}

{!!haveDetailedDNA &&(frsLabel == 'elevated') && <Text style={[styles.text, {lineHeight: 20}]}>
{i18n.t('result_FRS_elevated_DNA')}</Text>}

{!!haveDetailedDNA &&(frsLabel == 'high') && <Text style={[styles.text, {lineHeight: 20}]}>
{i18n.t('result_FRS_high_DNA')}</Text>}

{/*"if we don't have genetic report ..."*/}

{!haveDetailedDNA && (totalScore_r > 1.2) && <Text style={[styles.text, {lineHeight: 20}]}>
{i18n.t('result_FRS_you_have')}<Text style={{fontWeight: 'bold', lineHeight: 20}}>{totalScore_ab}%</Text>{i18n.t('result_FRS_10y')} {i18n.t('result_FRS_higher1')}
<Text style={{fontWeight: 'bold', lineHeight: 20}}>{totalScore_r}</Text>{i18n.t('result_FRS_higher2')} {i18n.t('result_FRS_update')}</Text>
}

{!haveDetailedDNA && (totalScore_r <= 1.2) && (totalScore_r >= 0.9) && <Text style={[styles.text, {lineHeight: 20}]}>
{i18n.t('result_FRS_you_have')}<Text style={{fontWeight: 'bold', lineHeight: 20}}>{totalScore_ab}%</Text>{i18n.t('result_FRS_10y')} {i18n.t('result_FRS_equal')} {i18n.t('result_FRS_update')}</Text>
}

{!haveDetailedDNA && (totalScore_r < 0.9) && <Text style={[styles.text, {lineHeight: 20}]}>
{i18n.t('result_FRS_you_have')}<Text style={{fontWeight: 'bold', lineHeight: 20}}>{totalScore_ab}%</Text>{i18n.t('result_FRS_10y')} {i18n.t('result_FRS_lower1')}
<Text style={{fontWeight: 'bold', lineHeight: 20}}>{((1-totalScore_r)*100).toFixed(1)}</Text>{i18n.t('result_FRS_lower2')} {i18n.t('result_FRS_update')}</Text>
}

{!haveDetailedDNA && (frsLabel == 'borderline') && <Text style={[styles.text, {lineHeight: 20}]}>
{i18n.t('result_FRS_borderline')}</Text>}

{!haveDetailedDNA &&(frsLabel == 'elevated') && <Text style={[styles.text, {lineHeight: 20}]}>
{i18n.t('result_FRS_elevated')}</Text>}

{!haveDetailedDNA &&(frsLabel == 'high') && <Text style={[styles.text, {lineHeight: 20}]}>
{i18n.t('result_FRS_high')}</Text>}

</View>

{/*What can I do?*/}
<View style={styles.row}>
<Text style={styles.title}>{i18n.t('result_advice')}</Text>
<Text style={[styles.text, {marginTop: 5}]}><Text style={styles.subHead}>{i18n.t('result_blood_pressure')}</Text>{` `}{varBPtext}</Text>
</View>

{/*APT III guidline*/}
<View style={styles.row}>

<Text style={styles.title}>{i18n.t('result_APT')}</Text>

<Text style={[styles.text, {marginTop: 5}]}><Text style={styles.subHead}>{i18n.t('result_tc')}</Text>{` `}{varCholesterol}</Text>

<Text style={[styles.text, {marginTop: 5}]}><Text style={styles.subHead}>{i18n.t('result_hdl_title')}</Text>{` `}{varHDL}</Text>

{ (smoking == 2 || bloodpressure >= 6 || hdlc <= 3 || diabetes == 2 || (gender == 1 && age >= 45) || (gender == 2 && age >= 55)) &&
  <Text style={[styles.text, {marginTop: 5}]}>
    <Text style={styles.subHead}>{i18n.t('result_major_r')}</Text>
  </Text>
}

{ smoking == 2 &&
  <View style={{flexDirection: 'row'}}>
  <Text>{'\u2022'}<Text style={[styles.text, {flex: 1, paddingLeft: 10}]}>{i18n.t('result_smoking')}</Text></Text>
  </View>
}

{ bloodpressure >= 6 &&
  <View style={{flexDirection: 'row'}}>
  <Text>{'\u2022'}<Text style={[styles.text, {flex: 1, paddingLeft: 10}]}>{i18n.t('result_hypertension')}</Text></Text>
  </View>
}
{ hdlc <= 3 &&
  <View style={{flexDirection: 'row'}}>
  <Text>{'\u2022'}<Text style={[styles.text, {flex: 1, paddingLeft: 10}]}>{i18n.t('result_hdl')}</Text></Text>
  </View>
}
{ diabetes == 2 &&
  <View style={{flexDirection: 'row'}}>
  <Text>{'\u2022'}<Text style={[styles.text, {flex: 1, paddingLeft: 10}]}>{i18n.t('result_diabetes')}</Text></Text>
  </View>
}
{ gender == 1 && age >= 45 &&
  <View style={{flexDirection: 'row'}}>
  <Text>{'\u2022'}<Text style={[styles.text, {flex: 1, paddingLeft: 10}]}>{i18n.t('result_age_male')}</Text></Text>
  </View>
}
{ gender == 2 && age >= 55 &&
  <View style={{flexDirection: 'row'}}>
  <Text>{'\u2022'}<Text style={[styles.text, {flex: 1, paddingLeft: 10}]}>{i18n.t('result_age_female')}</Text></Text>
  </View>
}

<Text style={[styles.text, {marginTop: 5, marginBottom: 100}]}>
  <Text style={styles.subHead}>{i18n.t('result_note')}</Text>{` `}{general_note}</Text>

</View></ScrollView></View>);}}

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

export default connect(mapStateToProps)(ResultFRSScreen);
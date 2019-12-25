import React from 'react';
import { connect } from 'react-redux';

import { StyleSheet, View, Text, ScrollView, TextInput, Platform, Dimensions, Image } from 'react-native';
import BasicButton from '../components/BasicButton';
import ProgressCircle from '../components/ProgressCircle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';
import LineChart from '../components/LineChart';

/*
In the demo scenario all the single lab results are provided by the backend, 
and all history plots are hardcoded.
*/

//redux
import { 
  giveAnswer, 
  calculateRiskScore 
} from '../redux/actions';

const hdlcList = [
  { label: '<0.9'    , value:  1 },
  { label: '0.9-0.99', value:  2 },
  { label: '1.0-1.09', value:  3 },
  { label: '1.1-1.19', value:  4 },
  { label: '1.2-1.29', value:  5 },
  { label: '1.3-1.39', value:  6 },
  { label: '1.4-1.49', value:  7 },
  { label: '1.5-1.59', value:  8 },
  { label: '1.6-1.69', value:  9 },
  { label: '1.7-1.79', value: 10 },
  { label: '>1.79'   , value: 11 }
];

const cholesterolList = [
  { label: '<3.6'    , value:  1 },
  { label: '3.6-4.09', value:  2 },
  { label: '4.1-4.49', value:  3 },
  { label: '4.5-4.89', value:  4 },
  { label: '4.9-5.19', value:  5 },
  { label: '5.2-5.49', value:  6 },
  { label: '5.5-5.79', value:  7 },
  { label: '5.8-6.19', value:  8 },
  { label: '6.2-6.49', value:  9 },
  { label: '6.5-6.79', value: 10 },
  { label: '6.8-7.20', value: 11 },
  { label: '>7.20'   , value: 12 }
];

const bloodpressureList = [
  { label: '<120'   , value:  1 },
  { label: '120-124', value:  2 },
  { label: '125-129', value:  3 },
  { label: '130-134', value:  4 },
  { label: '135-139', value:  5 },
  { label: '140-144', value:  6 },
  { label: '145-149', value:  7 },
  { label: '150-154', value:  8 },
  { label: '155-159', value:  9 },
  { label: '160-164', value: 10 },
  { label: '165-169', value: 11 }, 
  { label: '170-174', value: 12 }, 
  { label: '175-180', value: 13 }, 
  { label: '>180'   , value: 14 }
];

const getLabel = (list, value) => {
  const listObj = list.find(item => item.value === parseInt(value));
  return (listObj ? listObj.label : '');
}

const screenWidth = Dimensions.get('window').width;

class QuestionnaireScreenCardioDemo extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text 
        style={{
          fontSize: 19,
          color: colors.headerFontColor,
          fontFamily: colors.headerFont,
          marginLeft: "auto", 
          marginRight: "auto",
          textAlign: 'center',
          alignSelf: 'center',
        }}>
          {i18n.t('form_cardio_title')}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

constructor (props) {

    super(props);

    const { frs } = this.props.answer;

    this.state = {
      numberAnswered: (frs.numberAnswered || 0),
      frsCurrent: (frs.frsCurrent || false),
      FRScompute_progress: (this.props.answer.FRScompute_progress|| 0),
      FRScomputing: (this.props.answer.FRScomputing || false),
      recalculating: false,
    };

  }

  /*
    deals with missing config setting in Android, relating to the initial 
    postion of the data in the scrollview. Also deals with iOS without needing 
    the depreciated intialOffset
  */

  _onContentSizeChange() {
     let initialYScroll = 0;
     this.scrollView.scrollTo({x: 0, y: initialYScroll, animated: false});
  };

  handleSeeResult = () => {
    this.props.navigation.navigate('ResultFRS');
  }

  handleCalculate = () => {

    const { dispatch } = this.props;
    const { answers } = this.props.answer;
    const { account } = this.props.user;
    const { localResult } = this.props.result;

    //this will automatically compute various labels if we have gene_rr info etc. 
    //we do not need to call calculateRiskLabel because calculateRiskScore already takes care of that
    dispatch( calculateRiskScore(answers, localResult, account.UUID, account.id) );

    this.setState({ recalculating: true });

  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    const { frs } = nextProps.answer;
    const { localResult: nextLocalResult } = nextProps.result;
    const { localResult } = this.props.result;

    this.setState({
      numberAnswered: (frs.numberAnswered || 0),
      frsCurrent: (frs.frsCurrent || false),
      FRScompute_progress: (nextProps.answer.FRScompute_progress || 0),
      FRScomputing: (nextProps.answer.FRScomputing || false),
    });

    //kicks in if the backend has new values for the single answers

    if (nextLocalResult && localResult && nextLocalResult.lab_hdl !== localResult.lab_hdl && nextLocalResult.lab_hdl > 0) {
      
      //if (__DEV__) console.log('componentWillReceiveProps: dispatching newAnswer');
      
      let newAnswer = [
        { question_id : 'cholesterol', answer : nextLocalResult.lab_cho },
        { question_id : 'bloodpressure', answer : nextLocalResult.lab_bp },
        { question_id : 'hdlc', answer : nextLocalResult.lab_hdl }
      ];

      nextProps.dispatch(giveAnswer(newAnswer));

    }

    //automatically go to fresh result once calculation is done
    if ( this.state.recalculating && nextProps.answer.FRScompute_progress === 100 ) {
      this.setState({ recalculating : false });
      this.props.navigation.navigate('ResultFRS');
    }

  }

renderHdlHistoryChart = (widthP) => {

/*
  const { localResult } = this.props.result;
  if (!localResult || !localResult.lab_hdl_history) {return null;}
  let labs = localResult.lab_hdl_history.split('-');
*/

  //for testing
  let exampleLab = '19/03/18;1.30-07/06/18;1.20-03/09/18;1.36-27/12/18;1.42-19/03/19;1.80-30/09/19;1.18';

  //Let's get the results
  let labs = exampleLab.split('-');
    
  //regardless of length, show only last five to avoid overcrowding
  if(labs.length > 5) {
    labs = labs.slice(Math.max(labs.length - 5, 1))
  }

  let dataValues = [];

  for (let i = 0; i < labs.length; i++) {
    let time_val = labs[i].split(';');
    dataValues.push(parseFloat(time_val[1]));
  }

  return (
    <LineChart
      data={dataValues}
      width={widthP}
      height={120}
      yAxisLabels={[0.9, 1.2, 1.5, 1.8]}
      lineColor={colors.BDred}
      backLineColor={'#C8C8C8'}
      labelColor={'#C8C8C8'}
      fontFam={colors.headerFont}
    />
  )

  }

renderBpHistoryChart = (widthP) => {

/*
    const { localResult } = this.props.result;
    if (!localResult || !localResult.lab_bp_history) {return null;}
    let labs = localResult.lab_hdl_history.split('-');
*/
    //for testing
    let exampleLab = '19/03/18;100-07/06/18;110-03/09/18;123-27/12/18;99-19/03/19;117-30/09/19;137';

    //Let's get the results
    let labs = exampleLab.split('-');
    
    //regardless of length, show only last five to avoid overcrowding
    if(labs.length > 5) {
      labs = labs.slice(Math.max(labs.length - 5, 1))
    }

    let dataValues = [];

    for (let i = 0; i < labs.length; i++) {
      let time_val = labs[i].split(';');
      dataValues.push(parseFloat(time_val[1]));
    }

    return (
      <LineChart data={dataValues} width={widthP} height={120}
        yAxisLabels={[90, 120, 150, 180]}
        lineColor={'green'} backLineColor={'#C8C8C8'} labelColor={'#C8C8C8'}
        fontFam={colors.headerFont}
      />
    )
    
  }

renderChoHistoryChart = (widthP) => {

/*
    const { localResult } = this.props.result;
    if (!localResult || !localResult.lab_cho_history) {return null;}
    let labs = localResult.lab_cho_history.split('-');
*/

    //for testing
    let exampleLab = '19/03/18;4.4-07/06/18;4.2-03/09/18;4.2-27/12/18;4.2-19/03/19;4.3-30/09/19;4.47';

    //Let's get the results
    let labs = exampleLab.split('-');
    
    //regardless of length, show only last five to avoid overcrowding
    if(labs.length > 5) {
      labs = labs.slice(Math.max(labs.length - 5, 1))
    }

    let dataValues = [];

    for (let i = 0; i < labs.length; i++) {
      let time_val = labs[i].split(';');
      dataValues.push(parseFloat(time_val[1]));
    }

    return (
      <LineChart data={dataValues} width={widthP} height={120}
        yAxisLabels={[3.6, 4.8, 6.0, 7.2]}
        lineColor={'blue'} backLineColor={'#C8C8C8'} labelColor={'#C8C8C8'}
        fontFam={colors.headerFont}
      />
    )
    
  }

  render() {

    const { localResult } = this.props.result;

    const { frsCurrent, numberAnswered, FRScomputing, FRScompute_progress } = this.state;

    const resultDate = localResult.timestamp ? new Date(localResult.timestamp * 1000) : null;
    
    let resultDateString = '';
    
    if (resultDate) {
      resultDateString  = resultDate.getMonth() + '/';
      resultDateString += resultDate.getDate() + '/';
      resultDateString += resultDate.getFullYear();
    }
    
    //for demo purposes
    resultDateString = '30/09/19';
    localResult.lab_hdl = 4;
    localResult.lab_bp  = 5;
    localResult.lab_cho = 4;

    let resultHDL = i18n.t('form_lab_result');
    if( localResult.lab_hdl > 0 ) {
      resultHDL += ` ` + resultDateString + `: ` + getLabel(hdlcList, localResult.lab_hdl) + ` (mmol/L)`;
    } else {
      resultHDL += ` ` + i18n.t('form_lab_none');
    }

    let resultCHO = i18n.t('form_lab_result');
    if( localResult.lab_cho > 0 ) {
      resultCHO += ` ` + resultDateString + `: ` + getLabel(cholesterolList, localResult.lab_cho) + ` (mmol/L)`;
    } else {
      resultCHO += ` ` + i18n.t('form_lab_none');
    }

    let resultBP = i18n.t('form_lab_result');
    if( localResult.lab_bp > 0 ) {
      resultBP += ` ` + resultDateString + `: ` + getLabel(bloodpressureList, localResult.lab_bp) + ` (mmHg)`;
    } else {
      resultBP += `: ` + i18n.t('form_lab_none');
    }

    let internet = this.props.user.internet.internet_connected;
    let SMCservers = this.props.user.internet.servers_reachable;

    return (

<View style={styles.containerMain}>

<ScrollView 
  scrollEnabled={true}
  showsVerticalScrollIndicator={false}
  overScrollMode={'always'}
  ref={scrollView => this.scrollView = scrollView}
  onContentSizeChange={()=>{this._onContentSizeChange()}}
>

{/*makes sure there is nontrivial scroll magnitude
<View style={{height: 100}}/>
*/}

{!FRScomputing && (numberAnswered < 7) &&
  <View style={[styles.shadowBox, {
    marginTop: 13,
    marginBottom: 13,
    height: 100,
  }]}>
    <Text style={styles.smallGray}>{i18n.t('form_cardio_info')}</Text>
  </View>
}

{(numberAnswered > 6) && !frsCurrent && 
  <View style={[styles.shadowBoxClear, {height: 80}]}>
    <BasicButton 
      width={200}
      text={i18n.t('form_cardio_calculate')} 
      onClick={this.handleCalculate}
      no_internet={!internet || !SMCservers}
      todo={!SMCservers ? i18n.t('home_server_text') : i18n.t('global_internet_text_half') + i18n.t('form_calculate_risk')}
      title={!SMCservers ? i18n.t('home_server_title') : i18n.t('home_internet_title')}
    />
  </View>
}

{(numberAnswered > 6) && frsCurrent && 
  <View style={[styles.shadowBoxClear, {height: 80}]}>
    <BasicButton
      width={200} 
      text={i18n.t('form_cardio_result')} 
      onClick={this.handleSeeResult}
    />
  </View>
}

{/*show progress indicator when calculating risk*/}
{FRScomputing && <View 
  style={styles.containerProgress}>
    <ProgressCircle percent={FRScompute_progress}>
      <Ionicons name={`ios-cog`} size={35} color={colors.gray}/>
    </ProgressCircle>
    <View>
      {(FRScompute_progress   < 100) && <Text style={styles.progressText}>{i18n.t('form_cardio_mpc')}</Text>}
      {(FRScompute_progress === 100) && <Text style={styles.progressText}>{i18n.t('global_Done')}</Text>}
    </View>
  </View>
}

{/*show plots*/}
{!FRScomputing && <View>
  {/* HDL-C */}
  <View style={[styles.rowLabel,{marginTop: 0}]}>
    <Text style={styles.labelText}>{i18n.t('form_cardio_hdl')}</Text>
  </View>
  <View style={styles.shadowBox}>
    <Text style={styles.labResult}>{resultHDL}</Text>
    {/*the enclosing shadowBox is always 0.9 of the screenwidth*/}
    {this.renderHdlHistoryChart(0.88 * screenWidth)}
  </View>

  {/* CHOLESTEROL */}
  <View style={styles.rowLabel}>
    <Text style={styles.labelText}>{i18n.t('form_cardio_tc')}</Text>
  </View>
  <View style={styles.shadowBox}>
    <Text style={styles.labResult}>{resultCHO}</Text>
    {this.renderChoHistoryChart(0.88 * screenWidth)}
  </View>

  {/* BLOOD PRESSURE */}
  <View style={styles.rowLabel}>
    <Text style={styles.labelText}>{i18n.t('form_cardio_bp')}</Text>
  </View>
  <View style={styles.shadowBox}>
    <Text style={styles.labResult}>{resultBP}</Text>
    {this.renderBpHistoryChart(0.88 * screenWidth)}
  </View>

</View>
}

{/*makes sure there is nontrivial scroll magnitude
<View style={{height: 100}}/>
*/}

</ScrollView></View>);}}

const styles = StyleSheet.create({
  //for most of the text
  smallGray: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.gray,
  },
  shadowBox: {
    display: 'flex',
    marginTop: 3, //spacing between boxes
    backgroundColor: '#FFFFFF',
    width: screenWidth * 0.96,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.homeBoxesLineColor,
  },
  shadowBoxClear: {
    display: 'flex',
    marginTop: 13, //spacing between boxes
    width: screenWidth * 0.96,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 100,
  },
  containerMain: {
    flex: 1, 
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#EEF2F9',
  },
  containerProgress: {
    marginTop: 100,
    alignItems:'center',
    justifyContent:'center',
    flex:1,
  },
  progressText: {
    color: colors.gray,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'normal', 
    marginTop: 10,
    height: 54, 
    //don't change otherwise the progress indicator 
    //text jumps when the result is done, since the legends 
    //go from two lines to one line 
  },
  //e.g. HDL-C
  rowLabel: {
    marginTop: 25,
    marginBottom: 3,
    paddingLeft: 10,
  },
  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray,
  },
  labResult: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.gray,
    marginBottom: 5,
  },
});

const mapStateToProps = state => ({
  user: state.user,
  answer: state.answer,
  result: state.result,
});

export default connect(mapStateToProps)(QuestionnaireScreenCardioDemo);

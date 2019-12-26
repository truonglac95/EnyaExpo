import React from 'react';
import { connect } from 'react-redux';

import { StyleSheet, View, Text, TouchableOpacity, 
  ScrollView, TextInput, Platform, 
  Dimensions, Image
} from 'react-native';

import Picker from 'react-native-picker-select';
import BasicButton from '../components/BasicButton';
import ProgressCircle from '../components/ProgressCircle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';

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
const screenHeight = Dimensions.get('window').height;

class QuestionnaireScreenCardio extends React.Component {
  
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
          {i18n.t('form_cardio_title')}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

constructor (props) {

    super(props);

    const { answers, frs } = this.props.answer;

    this.state = {

      percentAnswered: (frs.percentAnswered || 0),
      numberAnswered: (frs.numberAnswered || 0),

      goodAnswersBasic: (frs.goodAnswersBasic || 0),
      goodAnswersCardio: (frs.goodAnswersCardio || 0),

      frsScore_ab: (frs.frsScore_ab || 0.0),
      frsScore_r: (frs.frsScore_r || 0.0),
      frsCurrent: (frs.frsCurrent || false),

      FRScompute_progress: (this.props.answer.FRScompute_progress|| 0),
      FRScomputing: (this.props.answer.FRScomputing || false),

      hdlc: (answers.hdlc || 0),
      cholesterol: (answers.cholesterol || 0),
      bloodpressure: (answers.bloodpressure || 0),

      recalculating: false,

    };
    
    this.inputRefs = {
      hdlcInput: null,
      cholesterolInput: null,
      bloodpressureInput: null,
    };

  }

  componentWillUnmount() {

    this.inputRefs = {
      hdlcInput: null,
      cholesterolInput: null,
      bloodpressureInput: null,
    };

  }

  handleSave = (key, value) => {

    const { dispatch } = this.props;

    if ( key === 'hdlc' ) {
      this.setState({ hdlc : value });
    } 
    else if ( key === 'cholesterol' ) { 
      this.setState({ cholesterol : value });
    } 
    else if ( key === 'bloodpressure' ) {
      this.setState({ bloodpressure : value });
    } 

    const newAnswer = [{ question_id : key, answer : value }];

    dispatch(giveAnswer(newAnswer));

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

  /*deals with missing config setting in Android, relating to the initial 
  postion of the data in the scrollview. Also deals with iOS without needing 
  the depreciated intialOffset*/
  _onContentSizeChange() {
     //let initialYScroll = 0;
     //this.scrollView.scrollTo({x: 0, y: initialYScroll, animated: false});
  };

  UNSAFE_componentWillReceiveProps(nextProps) {

    const { frs } = nextProps.answer;
    const { localResult: nextLocalResult } = nextProps.result;
    const { localResult } = this.props.result;

    this.setState({
      percentAnswered: (frs.percentAnswered || 0),
      numberAnswered: (frs.numberAnswered || 0),
      frsScore_ab: (frs.frsScore_ab|| 0.0),
      frsScore_r: (frs.frsScore_r|| 0.0),
      frsCurrent: (frs.frsCurrent || false),
      goodAnswersBasic: (frs.goodAnswersBasic || 0),
      goodAnswersCardio: (frs.goodAnswersCardio || 0),
      FRScompute_progress: (nextProps.answer.FRScompute_progress || 0),
      FRScomputing: (nextProps.answer.FRScomputing || false),
    });

    //if there are no lab results, then nextLocalResult.lab_hdl === 0 or undefined, 
    //and hence, user has to enter values
    if ( nextLocalResult && 
         localResult && 
         (nextLocalResult.lab_hdl !== localResult.lab_hdl) && 
         nextLocalResult.lab_hdl > 0 ) {
      
      //if (__DEV__) console.log('componentWillReceiveProps: dispatching newAnswer');
      
      let newAnswer = [
        { question_id : 'cholesterol', answer : nextLocalResult.lab_cho },
        { question_id : 'bloodpressure', answer : nextLocalResult.lab_bp },
        { question_id : 'hdlc', answer : nextLocalResult.lab_hdl }
      ];

      nextProps.dispatch(giveAnswer(newAnswer));
      
      this.setState({ 
        cholesterol : nextLocalResult.lab_cho,
        bloodpressure : nextLocalResult.lab_bp,
        hdlc : nextLocalResult.lab_hdl
      });

    }

    //automatically go to fresh result once calculation is done
    if ( this.state.recalculating && nextProps.answer.FRScompute_progress === 100 ) {
      this.setState({ recalculating : false });
      this.props.navigation.navigate('ResultFRS');
    }

  }

  render() {

    const { localResult } = this.props.result;

    const { bloodpressure, hdlc, cholesterol, goodAnswersBasic, goodAnswersCardio, 
      frsScore_ab, frsScore_r, frsCurrent,percentAnswered, numberAnswered, 
      FRScomputing, FRScompute_progress } = this.state;

    const pickerStyle = {
      done: {
        color: '#FB2E59',
      },
      icon: {
        display: 'none',
      },
      inputIOS: {
        fontSize: 18,
        color: colors.darkGray, //so that they are consistent with the labels
        flex: 1,
        width: 0,
        height: 0,
      },
      inputAndroid: { /*these are the touchable numbers*/
        fontSize: 18,
        color: colors.darkGray,
      },
    };

    const resultDate = localResult.timestamp ? new Date(localResult.timestamp * 1000) : null;
    
    let resultDateString = '';
    
    if (resultDate) {
      //const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      //resultDateString = monthNames[resultDate.getMonth()] + ' ';
      //to avoid needing to translate 
      resultDateString  = resultDate.getMonth() + '/';
      resultDateString += resultDate.getDate() + '/';
      resultDateString += resultDate.getFullYear();
    }

    return (

<View style={styles.containerMain}>
<View style={styles.containerContent}> 

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

{!FRScomputing && (numberAnswered < 10) &&
  <View style={[styles.shadowBox, {alignItems: 'center', marginTop: 13, fontSize: 20, lineHeight: 22}]}>
    <Text style={styles.smallGray}>{i18n.t('form_cardio_optional')}</Text>
  </View>
}

{(numberAnswered >= 7) && !frsCurrent && <View style={styles.shadowBoxClear}>
  <BasicButton 
    width={200}
    text={i18n.t('form_cardio_calculate')} 
    onClick={this.handleCalculate}
  />
  </View>
}

{(numberAnswered >= 7) && frsCurrent && <View style={styles.shadowBoxClear}>
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

{/*ask questions when not computing*/}
{!FRScomputing && <View>

  {/* HDL-C */}
  <View style={[styles.rowLabel,{marginTop: 0}]}>
    <Text style={styles.labelText}>{i18n.t('form_cardio_hdl')}</Text>
  </View>
  <View style={styles.shadowBox}>
    <View style={styles.row}>
      <View style={styles.labResultContainer}>
        <Text style={styles.labResult}>{i18n.t('form_lab_result')}</Text>
        {(localResult.lab_hdl === 0) && <Text style={styles.labResult}>{i18n.t('form_lab_none')}</Text>}
        {(localResult.r_state >=  4) && (localResult.lab_hdl > 0) && (!!resultDateString) && <Text style={styles.labResult}>{resultDateString}</Text>}
        {(localResult.r_state >=  4) && (localResult.lab_hdl > 0) && <Text style={styles.labResultValue}>{getLabel(hdlcList, localResult.lab_hdl)}</Text>}
      </View>
      <View style={styles.pickerContainer}>
      { Platform.OS == 'ios' && <View style={styles.pickerSub}>
          <TouchableOpacity onPress={() => { 
              this.inputRefs.hdlcInput.togglePicker(); 
              //the 5 is chosen to be a central value in the picker
              this.state.hdlc == 0 && this.setState({ hdlc : hdlcList[5].value });
            }}
          >
            <View style={styles.pickerIOS}>
              <Ionicons
                name="ios-arrow-up"
                size={38}
                color={colors.gray}
              />
              <Text style={this.state.hdlc == 0 ? styles.pickerTextOpacity : styles.pickerText}>
                {this.state.hdlc == 0 ? i18n.t('form_basic_please_select') : hdlcList[this.state.hdlc-1].label}
              </Text>
              <Ionicons
                name="ios-arrow-down"
                size={38}
                color={colors.gray}
              />
              <Picker
                items={hdlcList}
                value={hdlc}
                placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
                onValueChange={(v)=>{this.handleSave('hdlc', v)}}
                onDownArrow={()=>{this.inputRefs.cholesterolInput.togglePicker()}}
                ref={el=>{this.inputRefs.hdlcInput=el}}
                style={pickerStyle}
              />
            </View>
          </TouchableOpacity>
      </View> 
      }
      { Platform.OS == 'android' && <View style={styles.pickerSub}>
          <Ionicons
            name="ios-arrow-up"
            size={38}
            color={colors.gray}
          />
          <Picker
            items={hdlcList}
            value={hdlc}
            useNativeAndroidPickerStyle={false}
            placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
            onValueChange={(v)=>{this.handleSave('hdlc', v)}}
            style={pickerStyle}
          />
          <Ionicons
            name="ios-arrow-down"
            size={38}
            color={colors.gray}
          />
        </View>
      }
      </View>
    </View>
  </View>

  {/* Cholesterol */}
  <View style={styles.rowLabel}>
    <Text style={styles.labelText}>{i18n.t('form_cardio_tc')}</Text>
  </View>
  <View style={styles.shadowBox}>
    <View style={styles.row}>
      <View style={styles.labResultContainer}>
        <Text style={styles.labResult}>{i18n.t('form_lab_result')}</Text>
        {(localResult.lab_cho === 0) && <Text style={styles.labResult}>{i18n.t('form_lab_none')}</Text>}
        {(localResult.r_state >=  4) && (localResult.lab_cho > 0) && (!!resultDateString) && <Text style={styles.labResult}>{resultDateString}</Text>}
        {(localResult.r_state >=  4) && (localResult.lab_cho > 0) && <Text style={styles.labResultValue}>{getLabel(cholesterolList, localResult.lab_cho)}</Text>}
      </View>
      <View style={styles.pickerContainer}>
      { Platform.OS == 'ios' && <View style={styles.pickerSub}>
          <TouchableOpacity onPress={() => { 
              this.inputRefs.cholesterolInput.togglePicker();
              //the 5 is chosen to be a central value in the picker
              this.state.cholesterol == 0 && this.setState({ cholesterol : cholesterolList[5].value });
            }}
          >
            <View style={styles.pickerIOS}>
              <Ionicons
                name="ios-arrow-up"
                size={38}
                color={colors.gray}
              />
              <Text style={this.state.cholesterol == 0 ? styles.pickerTextOpacity : styles.pickerText}>
                {this.state.cholesterol == 0 ? i18n.t('form_basic_please_select') : cholesterolList[this.state.cholesterol-1].label}
              </Text>
              <Ionicons
                name="ios-arrow-down"
                size={38}
                color={colors.gray}
              />
              <Picker
                items={cholesterolList}
                value={cholesterol}
                placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
                onValueChange={(v)=>{this.handleSave('cholesterol', v)}}
                onUpArrow={()=>{this.inputRefs.hdlcInput.togglePicker()}}
                onDownArrow={()=>{this.inputRefs.bloodpressureInput.togglePicker()}}
                ref={el=>{this.inputRefs.cholesterolInput = el}}
                style={pickerStyle}
              />
            </View>
          </TouchableOpacity>
      </View> 
      }
      { Platform.OS == 'android' && <View style={styles.pickerSub}>
          <Ionicons
            name="ios-arrow-up"
            size={38}
            color={colors.gray}
          />
          <Picker
            items={cholesterolList}
            value={cholesterol}
            useNativeAndroidPickerStyle={false}
            placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
            onValueChange={(v)=>{this.handleSave('cholesterol', v)}}
            style={pickerStyle}
          />
          <Ionicons
            name="ios-arrow-down"
            size={38}
            color={colors.gray}
          />
        </View>
      }
      </View>
    </View>
  </View>

  {/* BP */}
  <View style={styles.rowLabel}>
    <Text style={styles.labelText}>{i18n.t('form_cardio_bp')}</Text>
  </View>
  <View style={styles.shadowBox}>
    <View style={styles.row}>
      <View style={styles.labResultContainer}>
        <Text style={styles.labResult}>{i18n.t('form_lab_result')}</Text>
          {(localResult.lab_bp === 0) && <Text style={styles.labResult}>{i18n.t('form_lab_none')}</Text>}
          {(localResult.r_state >= 4) && (localResult.lab_bp > 0) && (!!resultDateString) && <Text style={styles.labResult}>{resultDateString}</Text>}
          {(localResult.r_state >= 4) && (localResult.lab_bp > 0) && <Text style={styles.labResultValue}>{getLabel(bloodpressureList, localResult.lab_bp)}</Text>}
      </View>
      <View style={styles.pickerContainer}>
      { Platform.OS == 'ios' && <View style={styles.pickerSub}>
          <TouchableOpacity onPress={() => { 
              this.inputRefs.bloodpressureInput.togglePicker();
              this.state.bloodpressure == 0 && Platform.OS == 'ios' && this.setState({ bloodpressure : bloodpressureList[6].value });
            }}
          >
            <View style={styles.pickerIOS}>
              <Ionicons
                name="ios-arrow-up"
                size={38}
                color={colors.gray}
              />
              <Text style={this.state.bloodpressure == 0 ? styles.pickerTextOpacity : styles.pickerText}>
                {this.state.bloodpressure == 0 ? i18n.t('form_basic_please_select') : bloodpressureList[this.state.bloodpressure-1].label}
              </Text>
              <Ionicons
                name="ios-arrow-down"
                size={38}
                color={colors.gray}
              />
              <Picker
                items={bloodpressureList}
                value={bloodpressure}
                placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
                onValueChange={(v)=>{this.handleSave('bloodpressure', v)}}
                onUpArrow={()=>{this.inputRefs.cholesterolInput.togglePicker();}}
                ref={el=>{this.inputRefs.bloodpressureInput = el}}
                style={pickerStyle}
              />
            </View>
          </TouchableOpacity>
      </View> 
      }
      { Platform.OS == 'android' && <View style={styles.pickerSub}>
          <Ionicons
            name="ios-arrow-up"
            size={38}
            color={colors.gray}
          />
          <Picker
            items={bloodpressureList}
            value={bloodpressure}
            useNativeAndroidPickerStyle={false}
            placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
            onValueChange={(v)=>{this.handleSave('bloodpressure',v)}}
            style={pickerStyle}
          />
          <Ionicons
            name="ios-arrow-down"
            size={38}
            color={colors.gray}
          />
        </View>
      }
      </View>
    </View>
  </View>
</View>
}

{/*
to ensure nice non-trivial scrollability magnitude on both iOS and Android
<View style={{height: 100}}/>
*/}

</ScrollView>
</View></View>);}}

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
  row: {
    display: 'flex',
    width: screenWidth * 0.85,
    height: 100,
    flexDirection: 'row',
    alignItems:'center',
    //paddingTop: 5,
    //paddingBottom: 5,
    //paddingLeft: 5,
    //paddingRight: 5,
    //backgroundColor: 'red',
  },
  containerMain: {
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#EEF2F9',

  },
  containerContent: {
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  containerPrompt: {
    margin: 10,
    width: screenWidth * 0.96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prompt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray,
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
  pickerIOS: { /*applies only to iOS*/
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  labelText: {
    fontSize: 16,
    color: colors.gray,
  },
  labResultContainer:{
    alignSelf: 'flex-start',
    height: 100,
    width: 0.33 * screenWidth,
    borderRightWidth: 1,
    borderRightColor: colors.lightGray,
    //backgroundColor: 'yellow',
  },
  labResult: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: colors.lightGray,
  },
  pickerContainer: {
    alignSelf: 'flex-start',
    height: 100,
    //width: 0.55 * screenWidth,
    //width: 120,
    //backgroundColor: 'yellow',
  },
  pickerSub: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    width: 150,
  },
  labResultValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.lightGray,
    fontStyle: 'italic',
    marginTop: 15,
  },
  //typically used for the bold-faced label
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.questionText,
  },
  pickerTextOpacity: {
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.2,
    lineHeight: 22,
  },
  pickerText: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
});

const mapStateToProps = state => ({
  user: state.user,
  answer: state.answer,
  result: state.result,
});

export default connect(mapStateToProps)(QuestionnaireScreenCardio);
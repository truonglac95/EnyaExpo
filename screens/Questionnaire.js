import React from 'react';
import { connect } from 'react-redux';

//UI
import { StyleSheet, View, Text, TouchableOpacity, TextInput, 
  ScrollView, Platform, Dimensions, Keyboard, Image } from 'react-native';

import ProgressCircle from '../components/ProgressCircle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Picker from 'react-native-picker-select';
import BasicButton from '../components/BasicButton';
import colors from '../constants/Colors';
import mS from '../constants/masterStyle';

//redux
import { giveAnswer, secureCompute } from '../redux/actions';

const yearsList = [];
for (var i = 1920; i <= (new Date()).getFullYear(); i++) {
  yearsList.push({ label: `${i}`, value: i});
}

const weightList = [];
for (var i =  35; i <= 200; i++) {
  weightList.push({label: `${i} kg`, value: i});
}

const heightList = [];
for (var i = 120; i <= 215; i++) {
  heightList.push({label: `${i} cm`, value: i});
}

const countriesList = [
  { label: 'China' , value: 1 },
  { label: 'USA' , value: 2 }, 
  { label: 'Korea' , value: 3 }
];

const genderList = [
  { label: 'Male' , value: 1 }, 
  { label: 'Female' , value: 2 }
];

const smokingList = [
  { label: 'No' , value: 1 }, 
  { label: 'Yes' , value: 2 }
];

const diabetesList = [
  { label: 'No' , value: 1 }, 
  { label: 'Yes' , value: 2 }
];

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const getLabel = (list, value) => {
  const listObj = list.find(item => item.value === parseInt(value));
  return (listObj ? listObj.label : '');
}

class Questionnaire extends React.Component {

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
          {'Secure Compute'}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {

    super(props);

    const { answers, smc } = this.props.answer;
    const { localResult } = this.props.result;

    this.state = {

      percentAnswered: (smc.percentAnswered || 0),
      numberAnswered: (smc.numberAnswered || 0),

      birthyear: (answers.birthyear || 0),
      country: (answers.country || 0),
      gender:(answers.gender || 0),
      height: (answers.height || 0),
      smoking: (answers.smoking || 0),
      weight: (answers.weight || 0),
      diabetes: (answers.diabetes || 0),

      result: (smc.result || 0.0),
      current: (smc.current || false),

      SMC_compute_progress: (this.props.answer.SMC_compute_progress|| 0),
      SMC_computing: (this.props.answer.SMC_computing || false),
      
      recalculating: false,

    };
    
    this.inputRefs = {
      birthyearInput: null,
      countryInput: null,
      genderInput: null,
      heightInput: null,
      smokingInput: null,
      weightInput: null,
      diabetesInput: null,
    };

  }

  componentWillUnmount() {
    
    this.inputRefs = {
      birthyearInput: null,
      countryInput: null,
      genderInput: null,
      heightInput: null,
      smokingInput: null,
      weightInput: null,
      diabetesInput: null,
    };

  }

  handleSave = (key, value) => {

    const { dispatch } = this.props;

    if ( key === 'country' ) { 
      this.setState({ country : value })
    }
    else if ( key === 'gender' ) { 
      this.setState({ gender : value })
    }
    else if ( key === 'smoking' ) { 
      this.setState({ smoking : value })
    }
    else if ( key === 'birthyear' ){ 
      this.setState({ birthyear :value })
    }
    else if ( key === 'height' ) { 
      this.setState({ height : value })
    }
    else if ( key === 'weight' ) { 
      this.setState({ weight : value })
    }
    else if ( key === 'diabetes' ) {
      this.setState({ diabetes : value })
    }

    let newAnswer = [{ question_id : key, answer : value }];

    //if (__DEV__) console.log(newAnswer); 

    dispatch(giveAnswer(newAnswer));

  };

  handleSeeResult = () => {
    this.props.navigation.navigate('ResultSMC');
  }

  handleCalculate = () => {

    const { dispatch } = this.props;
    const { answers } = this.props.answer;
    const { account } = this.props.user;
    const { localResult } = this.props.result;

    dispatch( secureCompute(answers, account.UUID, account.id) );

    this.setState({ recalculating: true });

  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    const { smc } = nextProps.answer;
    const { localResult: nextLocalResult } = nextProps.result;
    const { localResult } = this.props.result;

    this.setState({
      percentAnswered: (smc.percentAnswered || 0),
      numberAnswered: (smc.numberAnswered || 0),
      result: (smc.result || 0.0),
      current: (smc.current || false),
      SMC_compute_progress: (nextProps.answer.SMC_compute_progress || 0),
      SMC_computing: (nextProps.answer.SMC_computing || false),
    });

    //go to fresh result once calculation is done
    if ( this.state.recalculating && nextProps.answer.SMC_compute_progress === 100 ) {
      this.setState({ recalculating : false });
      this.props.navigation.navigate('ResultSMC');
    }

  }

  render() {

    const { localResult } = this.props.result;

    const { birthyear, country, gender, smoking, height, weight, diabetes, hdlc, 
            result, current, percentAnswered, numberAnswered, 
            SMC_computing, SMC_compute_progress } = this.state;

    const pickerStyle = {
      done: {
        color: '#FB2E59',
      },
      icon: {
        display: 'none',
      },
      inputIOS: {
        fontSize: 18,
        color: colors.darkGray,
        flex: 1,
        width: 0,
        height: 0,
      },
      inputAndroid: {
        fontSize: 18,
        color: colors.darkGray,
        flex: 1,
        width: 270,
        height: 45,
      },
    };

    return (

<View style={styles.containerMain}>
<View style={styles.containerContent}> 

<ScrollView 
  scrollEnabled={true}
  showsVerticalScrollIndicator={false}
  overScrollMode={'always'}
  ref={scrollView => this.scrollView = scrollView}
>

{!SMC_computing && (numberAnswered < 7) &&
  <View style={[styles.shadowBox, {alignItems: 'center', marginTop: 13, fontSize: 20}]}>
    <Text style={styles.smallGray}>{'form_cardio_info'}</Text>
  </View>
}

{(numberAnswered >= 7) && !current && !SMC_computing && <View style={styles.shadowBoxClear}>
  <BasicButton 
    width={200}
    text={'Secure Compute'} 
    onClick={this.handleCalculate}
  />
  </View>
}

{(numberAnswered >= 7) && current && <View style={styles.shadowBoxClear}>
  <BasicButton
    width={200} 
    text={'See Result'} 
    onClick={this.handleSeeResult}
  />
  </View>
}

{/*show progress indicator when calculating risk*/}
{SMC_computing && <View 
  style={styles.containerProgress}>
    <ProgressCircle percent={SMC_compute_progress}/>
    <View>
      {(SMC_compute_progress   < 100) && <Text style={styles.progressText}>{'Computing'}</Text>}
      {(SMC_compute_progress === 100) && <Text style={styles.progressText}>{'Done'}</Text>}
    </View>
  </View>
}

{/*ask questions when not computing*/}
{!SMC_computing && 

<View style={styles.shadowBox}>

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={()=>{this.inputRefs.countryInput.togglePicker()}}>
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{'Country'}</Text></View>
<Text style={this.state.country == 0 ? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
  { this.state.country == 0 ? 'Please select' : countriesList[this.state.country-1].label }
</Text>
<Picker
  items={countriesList}
  value={country}
  placeholder={{label: 'Please select', value: 0}}
  onValueChange={(v)=>{this.handleSave('country',v)}}
  onDownArrow={()=>{this.inputRefs.birthyearInput.togglePicker();}}
  ref={el => { this.inputRefs.countryInput = el;}}
  style={pickerStyle}
/>
</View>
</TouchableOpacity>
}

{Platform.OS == 'android' &&
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{'Country'}</Text></View>
<Picker
  items={countriesList}
  value={country}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: 'Please select', value: 0}}
  onValueChange={(v)=>{this.handleSave('country',v)}}
  style={pickerStyle}
/>
</View>
}

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={()=>{
  this.inputRefs.birthyearInput.togglePicker(); 
  this.state.birthyear == 0 && this.setState({ birthyear : yearsList[30].value });
}}>
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{'Birthyear'}</Text></View>
<Text style={this.state.birthyear == 0 ? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.birthyear == 0 ? 'Please select': this.state.birthyear }
</Text>
<Picker
  items={yearsList}
  value={birthyear}
  placeholder={{label: 'Please select', value: 0}}
  onValueChange={(v)=>{this.handleSave('birthyear',v)}}
  onUpArrow  ={()=>{this.inputRefs.countryInput.togglePicker();}}
  onDownArrow={()=>{this.inputRefs.genderInput.togglePicker();}}
  ref={el=>{ this.inputRefs.birthyearInput = el}}
  style={pickerStyle}
/>
</View>
</TouchableOpacity>
}

{Platform.OS == 'android' &&
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{'Birthday'}</Text></View>
<Picker
  items={yearsList}
  value={birthyear}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: 'Please select', value: 0}}
  onValueChange={(v)=>{this.handleSave('birthyear',v)}}
  style={pickerStyle}
/>
</View>
}

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={()=>{this.inputRefs.genderInput.togglePicker()}}>
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{'Gender'}</Text></View>
<Text style={this.state.gender == 0 ? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.gender == 0 ? 'Please select': genderList[this.state.gender-1].label }
</Text>
<Picker
  items={genderList}
  value={gender}
  placeholder={{label: 'Please select', value: 0}}
  onValueChange={(v)=>{this.handleSave('gender',v)}}
  onUpArrow={()=>{this.inputRefs.birthyearInput.togglePicker()}}
  onDownArrow={()=>{this.inputRefs.heightInput.togglePicker()}}
  ref={el => { this.inputRefs.genderInput = el}}
  style={pickerStyle}
/>
  </View>
</TouchableOpacity>
}

{Platform.OS == 'android' &&
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{'Gender'}</Text></View>
<Picker
  items={genderList}
  value={gender}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: 'Please select', value: 0}}
  onValueChange={(v)=>{this.handleSave('gender',v)}}
  style={pickerStyle}
/>
</View>
}

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={() => { 
  this.inputRefs.heightInput.togglePicker(); 
  this.state.height == 0 && this.setState({ height : heightList[45].value });
}}>
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{'Height'}</Text></View>
<Text style={this.state.height == 0 ? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.height == 0 ? 'Please select': this.state.height + ' cm' }
</Text>
<Picker
  items={heightList}
  value={height}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: 'Please select', value: 0}}
  onValueChange={(v)=>{this.handleSave('height',v)}}
  onUpArrow  ={()=>{this.inputRefs.genderInput.togglePicker()}}
  onDownArrow={()=>{this.inputRefs.weightInput.togglePicker()}}
  ref={el => { this.inputRefs.heightInput = el}}
  style={pickerStyle}
/>
</View>
</TouchableOpacity>
}

{Platform.OS == 'android' &&
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{'form_basic_height'}</Text></View>
<Picker
  items={heightList}
  value={height}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: 'Please select', value: 0}}
  onValueChange={(v)=>{this.handleSave('height',v)}}
  style={pickerStyle}
/>
</View>
}

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={() => { 
  this.inputRefs.weightInput.togglePicker(); 
  this.state.weight == 0 && this.setState({ weight : weightList[45].value });
}}
>
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{'Weight'}</Text></View>
<Text style={this.state.weight == 0 ? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.weight == 0 ? 'Please select': this.state.weight + ' kg'}
</Text>
<Picker
  items={weightList}
  value={weight}
  onpress={() => {this.state.weight == 0 ? this.setState({ weight : weightList[45].value }) : this.setState({ weight : this.state.weight })}}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: 'Please select', value: 0}}
  onValueChange={(v)=>{this.handleSave('weight',v)}}
  onUpArrow  ={()=>{this.inputRefs.heightInput.togglePicker()}}
  onDownArrow={()=>{this.inputRefs.smokingInput.togglePicker()}}
  ref={el => { this.inputRefs.weightInput = el}}
  style={pickerStyle}
/>
</View>
</TouchableOpacity>
}

{Platform.OS == 'android' &&
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{'Weight'}</Text></View>
<Picker
  items={weightList}
  value={weight}
  onpress={()=>{this.state.weight == 0 ? this.setState({ weight : weightList[45].value }) : this.setState({ weight : this.state.weight })}}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: 'Please select', value: 0}}
  onValueChange={(v)=>{this.handleSave('weight',v)}}
  style={pickerStyle}
/>
</View>
}

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={()=>{this.inputRefs.smokingInput.togglePicker()}}>
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{'Smoking'}</Text></View>
<Text style={this.state.smoking == 0 ? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.smoking == 0 ? 'No/Yes': smokingList[this.state.smoking-1].label }
</Text>
<Picker
  items={smokingList}
  value={smoking}
  placeholder={{ label: 'No/Yes', value: 0}}
  //do not need the 'city' thing here because the keyboard blocks these anyway
  //so its impossible for someone to select these with the keyboard up
  onValueChange={(v)=>{this.handleSave('smoking',v)}}
  onUpArrow={()=>{this.inputRefs.weightInput.togglePicker()}}
  onDownArrow={()=>{this.inputRefs.diabetesInput.togglePicker()}}
  ref={el => { this.inputRefs.smokingInput = el}}
  style={pickerStyle}
/>
</View>
</TouchableOpacity>
}

{Platform.OS == 'android' &&
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{'Smoking'}</Text></View>
<Picker
  items={smokingList}
  value={smoking}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: 'No/Yes', value: 0}}
  onValueChange={(v)=>{this.handleSave('smoking',v)}}
  style={pickerStyle}
/>
</View>
}

{/* DIABETES */}
{Platform.OS == 'ios' &&
<TouchableOpacity onPress={()=>{this.inputRefs.diabetesInput.togglePicker()}}>
<View style={[styles.row, {borderBottomColor: '#FFFFFF'}]}>
<View style={styles.label}><Text style={styles.text}>{'Diabetes'}</Text></View>
<Text style={this.state.diabetes == 0 ? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.diabetes == 0 ? 'No/Yes': diabetesList[this.state.diabetes-1].label }
</Text>
<Picker
  items={diabetesList}
  value={diabetes}
  placeholder={{label: 'No/Yes', value: 0}}
  onValueChange={(v)=>{this.handleSave('diabetes',v)}}
  onUpArrow={()=>{this.inputRefs.smokingInput.togglePicker();}}
  ref={el=>{this.inputRefs.diabetesInput = el}}
  style={pickerStyle}
/>
</View>
</TouchableOpacity>
}

{Platform.OS == 'android' &&
<View style={[styles.row, {borderBottomColor: '#FFFFFF'}]}>
<View style={styles.label}><Text style={styles.text}>{'Diabetes'}</Text></View>
<Picker
  items={diabetesList}
  value={diabetes}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: 'No/Yes', value: 0}}
  onValueChange={(v)=>{this.handleSave('diabetes',v)}}
  style={pickerStyle}
/>
</View>
}

</View>
}

</ScrollView>
</View>
</View>);
}}

const styles = StyleSheet.create({
  //for most of the text
  smallGray: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.gray,
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
  shadowBox: {
    display: 'flex',
    marginTop: 13, //spacing between boxes
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
    height: Platform.OS === 'ios' ? 60 : 'auto',
    flexDirection: 'row',
    alignItems:'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  label: {
    marginRight: 10,
    width: 0.35 * screenWidth,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.questionText,
  },
});

const mapStateToProps = state => ({
  user: state.user,
  answer: state.answer,
  result: state.result,
  whitelist: state.whitelist,
});

export default connect(mapStateToProps)(Questionnaire);
import React from 'react';
import { connect } from 'react-redux';

//UI
import { View, Text, TouchableOpacity, TextInput, 
  ScrollView, Keyboard, Image, 
  Dimensions, ActivityIndicator } from 'react-native';

import Picker from 'react-native-picker-select';
import BasicButton from '../components/BasicButton';
import { mS } from '../constants/masterStyle';

//redux
import { giveAnswer, secureComputeSMC, secureComputeFHESimple, 
  secureComputeFHEBuffered, secureComputeInvalidate } from '../redux/actions';

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
  { label: 'USA' , value: 1 },
  { label: 'Other' , value: 2 },
];

const genderList = [
  { label: 'Male' , value: 1 }, 
  { label: 'Female' , value: 2 }
];

const Binary_1_List = [
  { label: 'No' , value: 1 }, 
  { label: 'Yes' , value: 2 }
];

const Binary_2_List = [
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
      headerTitle: () => (<Text style={mS.screenTitle}>{'Secure Compute'}</Text>),
      headerRight: (<View></View>)//
    }
  };

  constructor (props) {

    super(props);

    const { compute } = this.props;
    const { answers } = this.props.answer;
    const { account } = this.props.user;

    this.state = {
      result: (compute.result || 0.0),
      resultCurrent: (compute.current || false),
      computing: (compute.computing || false),

      birthyear: (answers.birthyear || 0),
      country: (answers.country || 0),
      gender:(answers.gender || 0),
      height: (answers.height || 0),
      weight: (answers.weight || 0),
      binary_1: (answers.binary_1 || 0),
      binary_2: (answers.binary_2 || 0),
      percentAnswered: (answers.percentAnswered || 0),
      numberAnswered: (answers.numberAnswered || 0),
      answersCurrent: (answers.answersCurrent || 0),

      FHE_keys_ready: (account.FHE_keys_ready || false),

      recalculating: false,
    }
    
    this.inputRefs = {
      birthyearInput: null,
      countryInput: null,
      genderInput: null,
      heightInput: null,
      weightInput: null,
      binary_1_Input: null,
      binary_2_Input: null,
    }

  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    const { compute } = nextProps;
    const { answers } = nextProps.answer;
    const { account } = nextProps.user;

    this.setState({
      percentAnswered: (answers.percentAnswered || 0),
      numberAnswered: (answers.numberAnswered || 0),
      answersCurrent: (answers.current || 0),

      result: (compute.result || 0.0),
      resultCurrent: (compute.current || false),
      computing: (compute.computing || false),

      FHE_keys_ready: (account.FHE_keys_ready || false),
    });

    //go to fresh result once calculation is done
    if ( this.state.recalculating && !this.state.computing ) {
      this.setState({recalculating: false });
      this.props.navigation.navigate('ResultSC');
    }

  }

  componentWillUnmount() {

    this.inputRefs = {
      birthyearInput: null,
      countryInput: null,
      genderInput: null,
      heightInput: null,
      weightInput: null,
      binary_1_Input: null,
      binary_2_Input: null,
    }

  }

  handleSave = (key, value) => {

    const { dispatch } = this.props;

    if ( key === 'country' ) { 
      this.setState({ country : value })
    }
    else if ( key === 'gender' ) { 
      this.setState({ gender : value })
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
    else if ( key === 'binary_1' ) { 
      this.setState({ binary_1 : value })
    }
    else if ( key === 'binary_2' ) {
      this.setState({ binary_2 : value })
    }

    let newAnswer = [{ question_id : key, answer : value }];

    dispatch(giveAnswer(newAnswer));
    dispatch(secureComputeInvalidate());

  };

  handleSeeResult = () => {
    this.props.navigation.navigate('ResultSC');
  }

  handleSMCCalculate = () => {
    const { answers } = this.props.answer;
    this.props.dispatch(secureComputeSMC(answers));
    this.setState({recalculating:true,computing:true});
  }

  handleFHECalculateS = () => {
    const { answers } = this.props.answer;
    this.props.dispatch(secureComputeFHESimple(answers));
    this.setState({recalculating:true,computing:true});
  }

  handleFHECalculateB = () => {
    const { answers } = this.props.answer;
    this.props.dispatch(secureComputeFHEBuffered(answers));
    this.setState({recalculating:true,computing:true});
  }

  render() {

    const { birthyear, country, gender, height, weight, binary_1, binary_2,
            answersCurrent, result, resultCurrent, 
            percentAnswered, numberAnswered, 
            computing, FHE_keys_ready } = this.state;

    const pickerStyle = {
      done: {color: '#FB2E59'},
      icon: {display: 'none'},
      inputIOS: {fontSize: 18,color: '#404040',flex: 1,width: 0,height: 0},
      inputAndroid: {fontSize: 18,color: '#404040',flex: 1,width: 270,height: 45},
    }

    return (

<View style={mS.containerMain}>

<ScrollView 
  scrollEnabled={true}
  showsVerticalScrollIndicator={false}
  overScrollMode={'always'}
  ref={scrollView => this.scrollView = scrollView}
>

{!computing && (numberAnswered >= 7) && !resultCurrent && 
<View style={[mS.shadowBoxClear,{height:180}]}>
  <BasicButton
    width={200}
    text={'SMC Secure Compute'} 
    onClick={this.handleSMCCalculate}
  />
  <View style={{marginTop: 20}}>
  <BasicButton 
    width={200}
    text={'FHE_S Secure Compute'} 
    onClick={this.handleFHECalculateS}
  />
  </View>
  <View style={{marginTop: 20}}>
  <BasicButton 
    width={200}
    text={'FHE_B Secure Compute'} 
    onClick={this.handleFHECalculateB}
    enable = {FHE_keys_ready}
  />
  </View>
</View>
}

{(numberAnswered >= 7) && resultCurrent && 
<View style={[mS.shadowBoxClear]}>
  <BasicButton
    width={200} 
    text={'See Result'} 
    onClick={this.handleSeeResult}
  />
</View>
}

{/*show progress indicator when calculating risk*/}
{computing && 
<View style={[mS.containerProgress, {marginTop: 100}]}>
  <ActivityIndicator size="large" color='#33337F' />
  <Text style={mS.progressText}>{'Computing'}</Text>
</View>
}

{/*ask questions when not computing*/}
{!computing && <View style={mS.shadowBoxQ}>

{(numberAnswered < 7) && 
<View style={[mS.rowQ,{height:90, paddingLeft:5, paddingRight:5, paddingBottom: 10}]}>
  <Text style={[mS.smallGray,{fontSize:16,fontStyle:'italic'}]}>
  {'Please answer the questions. All calculations use ' +
  'secure computation to ensure your privacy.'}</Text>
</View>
}

{(numberAnswered >= 7) && resultCurrent && 
<View style={[mS.rowQ,{height:90, paddingLeft:5, paddingRight:5, paddingBottom: 10}]}>
  <Text style={[mS.smallGray,{fontSize:16,fontStyle:'italic'}]}>
  {'To recompute your score or try a different API, ' +
  'change one or more of the values below.'}</Text>
</View>
}

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={()=>{this.inputRefs.countryInput.togglePicker()}}>
<View style={mS.rowQ}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Country'}</Text></View>
<Text style={this.state.country == 0 ? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
  { this.state.country == 0 ? 'Please select' : countriesList[this.state.country-1].label }
</Text>
<Picker
  items={countriesList}
  value={country}
  placeholder={{label: 'Please select', value: 0}}
  onValueChange={(v)=>{this.handleSave('country',v)}}
  onDownArrow={()=>{this.inputRefs.birthyearInput.togglePicker();}}
  ref={el => {this.inputRefs.countryInput = el;}}
  style={pickerStyle}
/>
</View>
</TouchableOpacity>
}

{Platform.OS == 'android' &&
<View style={mS.rowQ}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Country'}</Text></View>
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
<View style={mS.rowQ}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Birthyear'}</Text></View>
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
<View style={mS.rowQ}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Birthday'}</Text></View>
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

{Platform.OS == 'ios' && //
<TouchableOpacity onPress={()=>{this.inputRefs.genderInput.togglePicker()}}>
<View style={mS.rowQ}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Gender'}</Text></View>
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
<View style={mS.rowQ}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Gender'}</Text></View>
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

{Platform.OS == 'ios' && //
<TouchableOpacity onPress={() => { 
  this.inputRefs.heightInput.togglePicker(); 
  this.state.height == 0 && this.setState({ height : heightList[45].value });
}}>
<View style={mS.rowQ}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Height'}</Text></View>
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
<View style={mS.rowQ}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Height'}</Text></View>
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

{Platform.OS == 'ios' && //
<TouchableOpacity onPress={() => { 
  this.inputRefs.weightInput.togglePicker(); 
  this.state.weight == 0 && this.setState({ weight : weightList[45].value });
}}
>
<View style={mS.rowQ}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Weight'}</Text></View>
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
  onDownArrow={()=>{this.inputRefs.binary_1_Input.togglePicker()}}
  ref={el => { this.inputRefs.weightInput = el}}
  style={pickerStyle}
/>
</View>
</TouchableOpacity>
}

{Platform.OS == 'android' && //
<View style={mS.rowQ}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Weight'}</Text></View>
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
<TouchableOpacity onPress={()=>{this.inputRefs.binary_1_Input.togglePicker()}}>
<View style={mS.rowQ}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Binary_1'}</Text></View>
<Text style={this.state.binary_1 == 0 ? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.binary_1 == 0 ? 'No/Yes': Binary_1_List[this.state.binary_1-1].label }
</Text>
<Picker
  items={Binary_1_List}
  value={binary_1}
  placeholder={{ label: 'No/Yes', value: 0}}
  //do not need the 'city' thing here because the keyboard blocks these anyway
  //so its impossible for someone to select these with the keyboard up
  onValueChange={(v)=>{this.handleSave('binary_1',v)}}
  onUpArrow={()=>{this.inputRefs.weightInput.togglePicker()}}
  onDownArrow={()=>{this.inputRefs.binary_2_Input.togglePicker()}}
  ref={el => { this.inputRefs.binary_1_Input = el}}
  style={pickerStyle}
/>
</View>
</TouchableOpacity>
}

{Platform.OS == 'android' &&
<View style={mS.rowQ}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Binary_1'}</Text></View>
<Picker
  items={Binary_1_List}
  value={binary_1}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: 'No/Yes', value: 0}}
  onValueChange={(v)=>{this.handleSave('binary_1',v)}}
  style={pickerStyle}
/>
</View>
}

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={()=>{this.inputRefs.binary_2_Input.togglePicker()}}>
<View style={[mS.rowQ, {borderBottomColor: '#FFFFFF'}]}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Binary_2'}</Text></View>
<Text style={this.state.binary_2 == 0 ? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.binary_2 == 0 ? 'No/Yes': Binary_2_List[this.state.binary_2-1].label }
</Text>
<Picker
  items={Binary_2_List}
  value={binary_2}
  placeholder={{label: 'No/Yes', value: 0}}
  onValueChange={(v)=>{this.handleSave('binary_2',v)}}
  onUpArrow={()=>{this.inputRefs.binary_1_Input.togglePicker();}}
  ref={el=>{this.inputRefs.binary_2_Input = el}}
  style={pickerStyle}
/>
</View>
</TouchableOpacity>
}

{Platform.OS == 'android' &&
<View style={[mS.rowQ, {borderBottomColor: '#FFFFFF'}]}>
<View style={mS.labelQ}><Text style={mS.textQ}>{'Binary_2'}</Text></View>
<Picker
  items={Binary_2_List}
  value={binary_2}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: 'No/Yes', value: 0}}
  onValueChange={(v)=>{this.handleSave('binary_2',v)}}
  style={pickerStyle}
/>
</View>
}

</View>
}

</ScrollView>
</View>
);
}}

const mapStateToProps = state => ({
  user: state.user,
  answer: state.answer,
  compute: state.compute,
});

export default connect(mapStateToProps)(Questionnaire);

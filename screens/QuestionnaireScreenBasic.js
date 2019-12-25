import React from 'react';
import { connect } from 'react-redux';

import { StyleSheet, View, Text, TouchableOpacity, 
  ScrollView, Platform, Dimensions, Keyboard, Image } from 'react-native';

import Picker from 'react-native-picker-select';
import BasicButton from '../components/BasicButton';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';

//redux
import { giveAnswer } from '../redux/actions';

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
  { label: i18n.t('form_basic_HongKong'), value: 1 },
  { label: i18n.t('form_basic_China'), value: 2 },
  { label: i18n.t('form_basic_USA'), value: 3 }, 
  { label: i18n.t('form_basic_Singapore'), value: 4 }
];

const genderList = [
  { label: i18n.t('form_basic_Male'), value: 1 }, 
  { label: i18n.t('form_basic_Female'), value: 2 }
];

const smokingList = [
  { label: i18n.t('global_no'), value: 1 }, 
  { label: i18n.t('global_yes'), value: 2 }
];

const diabetesList = [
  { label: i18n.t('global_no'), value: 1 }, 
  { label: i18n.t('global_yes'), value: 2 }
];

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class QuestionnaireScreenBasic extends React.Component {

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
          {i18n.t('form_basic_title')}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {

    super(props);

    const { answers, frs } = this.props.answer;
    const { status } = this.props.whitelist;
    const { localResult } = this.props.result;

    this.state = {
      goodAnswersBasic: (frs.goodAnswersBasic || 0),
      birthyear: (answers.birthyear || 0),
      country: (answers.country || 0),
      gender:(answers.gender || 0),
      height: (answers.height || 0),
      smoking: (answers.smoking || 0),
      weight: (answers.weight || 0),
      diabetes: (answers.diabetes || 0),
      status: (status || 0),
      dnaStatus: (localResult.r_state || 0), //result type
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

    //if (__DEV__) console.log('saving');

    if ( key === 'country' ) { this.setState({ country : value });}
    else if ( key === 'gender' ) { this.setState({ gender : value });}
    else if ( key === 'smoking' ) { this.setState({ smoking : value });}
    else if ( key === 'birthyear' ){ this.setState({ birthyear :value });}
    else if ( key === 'height' ) { this.setState({ height : value });}
    else if ( key === 'weight' ) { this.setState({ weight : value });}
    else if ( key === 'diabetes' ) {this.setState({ diabetes : value });} 
    //}

    let newAnswer = [{ question_id : key, answer : value }];

    //if (__DEV__) console.log(newAnswer); 
    this.props.dispatch(giveAnswer(newAnswer));

  };

  handleContinue = () => {

    if( this.state.status === 2 ) {
      this.props.navigation.navigate('QcardioDemo');
    } else {
      this.props.navigation.navigate('Qcardio');
    }

  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    const { frs } = nextProps.answer;
    const { status } = nextProps.whitelist;
    const { localResult } = nextProps.result;

    this.setState({
      goodAnswersBasic: (frs.goodAnswersBasic || 0),
      status: (status || 0),
      dnaStatus: (localResult.r_state || 0), //result type
    });

  }

  /*deals with missing config setting in Android, relating to the initial 
  postion of the data in the scrollview. Also deals with iOS without needing 
  the depreciated intialOffset*/
  _onContentSizeChange() {
     //let initialYScroll = 0;
     //this.scrollView.scrollTo({x: 0, y: initialYScroll, animated: false});
  };

  render() {
    
    const { birthyear, country, gender, smoking, 
            height, weight, diabetes, goodAnswersBasic } = this.state;

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
  onContentSizeChange={()=>{this._onContentSizeChange()}}
>

{/*<View style={{height: 100}}/>*/}

{(goodAnswersBasic < 7) && 
  <View style={[styles.shadowBox, {height: 100, alignItems: 'center'}]}>
    <Text style={styles.smallGray}>{i18n.t('form_cardio_info')}</Text>
  </View>
}

{(goodAnswersBasic >= 7) && 
  <View style={styles.shadowBoxClear}>
    <BasicButton
      width={200}
      text={i18n.t('form_basic_continue')} 
      onClick={this.handleContinue}
    />
  </View>
}

<View style={styles.shadowBox}>

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={()=>{this.inputRefs.countryInput.togglePicker()}}>
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_country')}</Text></View>
<Text style={this.state.country == 0? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
  { this.state.country == 0 ? i18n.t('form_basic_please_select'): countriesList[this.state.country-1].label }
</Text>
<Picker
  items={countriesList}
  value={country}
  placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
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
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_country')}</Text></View>
<Picker
  items={countriesList}
  value={country}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
  onValueChange={(v)=>{this.handleSave('country',v)}}
  style={pickerStyle}
/>
</View>
}

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={() => { 
    this.inputRefs.birthyearInput.togglePicker(); 
    this.state.birthyear == 0 && this.setState({ birthyear : yearsList[30].value });
  }}
>
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_birthday')}</Text></View>
<Text style={this.state.birthyear == 0? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.birthyear == 0 ? i18n.t('form_basic_please_select'): this.state.birthyear }
</Text>
<Picker
  items={yearsList}
  value={birthyear}
  placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
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
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_birthday')}</Text></View>
<Picker
  items={yearsList}
  value={birthyear}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
  onValueChange={(v)=>{this.handleSave('birthyear',v)}}
  style={pickerStyle}
/>
</View>
}

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={()=>{this.inputRefs.genderInput.togglePicker()}}>
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_gender')}</Text></View>
<Text style={this.state.gender == 0? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.gender == 0 ? i18n.t('form_basic_please_select'): genderList[this.state.gender-1].label }
</Text>
<Picker
  items={genderList}
  value={gender}
  placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
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
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_gender')}</Text></View>
<Picker
  items={genderList}
  value={gender}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
  onValueChange={(v)=>{this.handleSave('gender',v)}}
  style={pickerStyle}
/>
</View>
}

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={() => { 
  this.inputRefs.heightInput.togglePicker(); 
  this.state.height == 0 && this.setState({ height : heightList[45].value });
  }}
>
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_height')}</Text></View>
<Text style={this.state.height == 0? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.height == 0 ? i18n.t('form_basic_please_select'): this.state.height + ' cm' }
</Text>
<Picker
  items={heightList}
  value={height}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
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
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_height')}</Text></View>
<Picker
  items={heightList}
  value={height}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
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
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_weight')}</Text></View>
<Text style={this.state.weight == 0? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.weight == 0 ? i18n.t('form_basic_please_select'): this.state.weight + ' kg'}
</Text>
<Picker
  items={weightList}
  value={weight}
  onpress={() => {this.state.weight == 0 ? this.setState({ weight : weightList[45].value }) : this.setState({ weight : this.state.weight })}}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
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
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_weight')}</Text></View>
<Picker
  items={weightList}
  value={weight}
  onpress={()=>{this.state.weight == 0 ? this.setState({ weight : weightList[45].value }) : this.setState({ weight : this.state.weight })}}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: i18n.t('form_basic_please_select'), value: 0}}
  onValueChange={(v)=>{this.handleSave('weight',v)}}
  style={pickerStyle}
/>
</View>
}

{Platform.OS == 'ios' &&
<TouchableOpacity onPress={()=>{this.inputRefs.smokingInput.togglePicker()}}>
<View style={styles.row}>
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_smoke')}</Text></View>
<Text style={this.state.smoking == 0? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.smoking == 0 ? i18n.t('form_basic_yes_no'): smokingList[this.state.smoking-1].label }
</Text>
<Picker
  items={smokingList}
  value={smoking}
  placeholder={{ label: i18n.t('form_basic_yes_no'), value: 0}}
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
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_smoke')}</Text></View>
<Picker
  items={smokingList}
  value={smoking}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: i18n.t('form_basic_yes_no'), value: 0}}
  onValueChange={(v)=>{this.handleSave('smoking',v)}}
  style={pickerStyle}
/>
</View>
}

{/* DIABETES */}
{Platform.OS == 'ios' &&
<TouchableOpacity onPress={()=>{this.inputRefs.diabetesInput.togglePicker()}}>
<View style={[styles.row, {borderBottomColor: '#FFFFFF'}]}>
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_diabetes')}</Text></View>
<Text style={this.state.diabetes == 0? { fontSize: 18, opacity: 0.2 }:{ fontSize: 18 }}>
{ this.state.diabetes == 0 ? i18n.t('form_basic_yes_no'): diabetesList[this.state.diabetes-1].label }
</Text>
<Picker
  items={diabetesList}
  value={diabetes}
  placeholder={{label: i18n.t('form_basic_yes_no'), value: 0}}
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
<View style={styles.label}><Text style={styles.text}>{i18n.t('form_basic_diabetes')}</Text></View>
<Picker
  items={diabetesList}
  value={diabetes}
  useNativeAndroidPickerStyle={false}
  placeholder={{label: i18n.t('form_basic_yes_no'), value: 0}}
  onValueChange={(v)=>{this.handleSave('diabetes',v)}}
  style={pickerStyle}
/>
</View>
}

</View>
</ScrollView>

</View></View>);}}

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

export default connect(mapStateToProps)(QuestionnaireScreenBasic);

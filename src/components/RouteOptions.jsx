import React, {Component} from 'react'
import Select from 'react-select'

const RtOptions = [
    { value: 'practical', label: 'Practical' },
    { value: 'shortest', label: 'Shortest' },
    { value: 'interstate', label: 'Interstate' }
  ]
  
  const MySelect = () => (
    <Select  options={RtOptions} />
  )

  export default () => (
    <Select 
    className= "w-60 "
    options={RtOptions}
      defaultValue={RtOptions[0]}
      
    />
  );
  

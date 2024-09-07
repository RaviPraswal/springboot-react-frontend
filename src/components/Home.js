import React, {Component} from 'react';

class Home extends Component{
    render(){
        const homeStyle={
            display:"flex",
            justifyContent:"center"
        }
        return(
            <div className="" style={homeStyle}>
                <h1>Welcome to My Tech World</h1>
            </div>
        )
    }
}
export default Home

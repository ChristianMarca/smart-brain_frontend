import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class ProfileIcon extends React.Component{
  constructor(props){
    super(props);

    this.state={
      dropdownOpen: false
    };
  }

  toggle=()=> {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render(){
    return(
      <div className="pa4 tc">
         <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle
              tag="span"
              data-toggle="dropdown"
              aria-expanded={this.state.dropdownOpen}
            >
                <img
                    src="http://tachyons.io/img/logo.jpg"
                    className="br-100 ba h3 w3 dib" alt="avatar" />
            </DropdownToggle>
            <DropdownMenu 
              right
              className='b--transparent shadow-5'
              style={{backgroundColor: "rgba(255,255,255,0.5)"} }
            >
              <DropdownItem onClick={this.props.toogleModal}>View Profile</DropdownItem>
              <DropdownItem onClick={()=>this.props.onRouteChange('Signout')}>Sign Out</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>

      </div>
    );
  }
}

export default ProfileIcon;
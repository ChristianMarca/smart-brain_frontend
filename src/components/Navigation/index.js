import React from 'react';
import ProfileIcon from '../profile/ProfileIcon'

const Navigation =({onRouteChange,isSignedIn,toogleModal})=>{
		if (isSignedIn){
			return(
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<ProfileIcon onRouteChange={onRouteChange} toogleModal={toogleModal}/>
				{/* <p onClick={()=>onRouteChange('Singout')} className='f3 link dim black underline pa3 pointer'>Sign Out </p> */}
			</nav>
			)
		}else{
			return(
				<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
					<p onClick={()=>onRouteChange('Signin')} className='f3 link dim black underline pa3 pointer'>Sign In </p>
					<p onClick={()=>onRouteChange('Register')} className='f3 link dim black underline pa3 pointer'>Register </p>
				</nav>
			)
		}
}

export default Navigation;
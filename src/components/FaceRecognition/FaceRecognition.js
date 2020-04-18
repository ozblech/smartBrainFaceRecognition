import React from 'react'
import './FaceRecognition.css'

const FaceRecognition = ({ imgURL, boxArray }) => {
	return (
		<div className='center ma'>
			<div className='absolute mt4'>
				<img id='inputImage' alt='' src={imgURL} width='500px' height='auto'/>
				{
				boxArray.map((task, i) => {
					return (
						<div 
						key={i}
						className='bounding-box' 
						style={{top:boxArray[i].topRow, right: boxArray[i].rightCol, 
						bottom: boxArray[i].bottomRow, left: boxArray[i].leftCol}} 
						/>
					);
				})
				}
			</div>
		</div>
		);
}

export default FaceRecognition;
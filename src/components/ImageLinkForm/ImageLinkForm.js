import React from 'react'
import './ImageLinkForm.css'

const ImageLinkForm = ({ onInputChange, onImageSubmit }) => {
	return (
		<div>
			<p className='f2'>
				{'Face Recognition App'}

			</p>
			<p className='f3'>
				{'This Magic Brain will detect faces in your pictures. Give it a try.'}
			</p>
			<p className='f4'>
				{'How does it work? Simply copy and paste here the address link of your favorite online photo. Try it!'}
			</p>
			<div className='center'>
				<div className='form center pa4 br3 shadow-5'>
					<input className='f4 pa2 w-70 center' type = 'tex' onChange={onInputChange} />
					<button 
						className='w-30 grow f4 link ph3 pv dib white bg-light-purple'
						onClick= {onImageSubmit}
						>Detect</button>
				</div>
			</div>
		</div>
		);
}

export default ImageLinkForm;
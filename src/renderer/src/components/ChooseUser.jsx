import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectUser } from '../slice/userSlice';
import { loadUsers } from '../utils/actions.js';
import { useNavigate } from 'react-router-dom';

const ChooseUser = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [displayUsers, setdisplayUsers] = useState([]);

	useEffect(() => {
		dispatch(loadUsers());
	}, [dispatch]);
	const users = useSelector((state) => state.user.users);
	const loading = useSelector((state) => state.user.loading);
	const error = useSelector((state) => state.user.error);

	//blocks that will have the usernames that choose user when clicked
	const userBlock = () => {
		return (
			<span className="flex flex-wrap">
				{Object.keys(users).map((item) => {
					return (
						<div
							key={item}
							className="flex w-1/5 flex-col items-center justify-center rounded-3xl duration-150 ease-out hover:cursor-pointer hover:ring-2 hover:ring-black hover:duration-200 hover:ease-in"
						>
							<img src="./src/assets/images/default_image.jpg" alt="user pic" className="h-11" />
							{item}
						</div>
					);
				})}
			</span>
		);
	};

	//handler for when user is chose
	const handleChoose = (e, id) => {
		e.preventDefault();
	};

	//handler to create new user
	const createNewUser = () => {
		navigate('createUser');
	};

	return (
		<section className="mx-auto my-auto flex h-4/5 w-3/4 flex-col items-center overflow-y-auto">
			<div>
				<h1> Choose User</h1>
				{loading ? <h1>loading...</h1> : <div>{userBlock()}</div>}

				<button onClick={createNewUser}> create new user </button>
			</div>
		</section>
	);
};

export default ChooseUser;

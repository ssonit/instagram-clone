import { Link } from 'react-router-dom';
import Button from '~/components/Form/Button';
import ButtonFacebook from '~/components/Form/ButtonFacebook';
import Divider from '~/components/Form/Divider';
import Input from '~/components/Form/Input';
import FormLayout from '~/layouts/FormLayout';
import { useForm } from 'react-hook-form';
import { FormState } from '~/types/auth';
import InputPassword from '~/components/Form/InputPassword';
import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '~/services/auth';
import { getIsLogin } from '~/utils/constants';
import { useUserStore } from '~/store/store';

const initialFormState: FormState = {
  email: '',
  password: '',
  fullname: '',
  username: '',
};
const Register: FC = () => {
  const { setCurrentUser } = useUserStore((state) => state);

  const { control, handleSubmit } = useForm<FormState>({
    defaultValues: initialFormState,
    mode: 'onChange',
  });

  const registerUserMutation = useMutation({
    mutationFn: (body: FormState) => registerUser(body),
  });

  const handleSignUp = (values: FormState) => {
    const isLogin = getIsLogin();
    if (isLogin) return;
    registerUserMutation.mutate(values, {
      onSuccess: (data) => {
        localStorage.setItem('login', JSON.stringify(true));
        setCurrentUser(data.data.data);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <FormLayout>
      <form className='flex flex-col items-center' onSubmit={handleSubmit(handleSignUp)}>
        <div className='mb-1 font-semibold text-center'>
          Sign up to see photos and videos from friends.
        </div>
        <div className='w-full mt-1'>
          <ButtonFacebook></ButtonFacebook>
        </div>
        <Divider></Divider>
        <div className='flex flex-col w-full gap-2 mt-3 mb-3'>
          <Input
            control={control}
            name='email'
            placeholder='Phone number, username or email address'
          ></Input>
          <Input control={control} name='fullname' placeholder='Fullname'></Input>
          <Input control={control} name='username' placeholder='Username'></Input>
          <InputPassword control={control}></InputPassword>
        </div>
        <Button type='submit' text='Sign Up' isLoading={registerUserMutation.isLoading}></Button>
        <div className='fixed bottom-0 w-full py-3 text-sm text-center transition-all border-t sm:pt-5 sm:pb-2 sm:relative sm:border-transparent border-grayPrimary'>
          Do not have an account?{' '}
          <Link to='/login' className='font-semibold cursor-pointer'>
            Sign In
          </Link>
        </div>
      </form>
    </FormLayout>
  );
};

export default Register;

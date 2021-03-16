import React, { useCallback, useRef } from "react";
import { FiArrowLeft, FiMail, FiUser, FiLock } from "react-icons/fi";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import getValidationsErrors from "../../utils/getValidationErrors";

import api from "../../services/api";

import LogoImg from "../../assets/logo.svg";
import { useToast } from "../../hooks/toast";
import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, Background, AnimationContainer } from "./styles";
interface SignupFormData {
  name: string;
  email: string;
  password: string;
}
const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: SignupFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("Digite um e-mail válido"),
          password: Yup.string().min(6, "No minimo 6 dígitos"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post("/users", data);

        history.push("/");

        addToast({
          type: "success",
          title: "Cadastro realizado",
          description: "Voce já pode fazer seu login no Go Barber",
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationsErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: "error",
          title: "Erro na cadastro",
          description: "Ocorreu um erro ao fazer cadastro, tente novamente.",
        });
      }
    },
    [addToast, history]
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={LogoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Cadastro</h1>
            <Input icon={FiUser} name="name" placeholder="Nome" />
            <Input icon={FiMail} name="email" placeholder="email" />
            <Input
              icon={FiLock}
              name="password"
              placeholder="Senha"
              type="password"
            />
            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;

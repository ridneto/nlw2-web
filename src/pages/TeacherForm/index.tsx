import React, { useState, FormEvent, useEffect } from 'react';
import { useHistory } from 'react-router-dom'

import warningIcon from '../../assets/images/icons/warning.svg'

import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input'
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';

import SubjectsService, { ISubjectItemView } from '../../services/subjectsService';
import api from '../../services/api';

import './styles.css'

const TeacherForm: React.FC = () => {
  const history = useHistory()

  const [subjectList, setSubjectList] = useState<ISubjectItemView[]>([]);

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');
  const [subject, setSubject] = useState('');
  const [cost, setCost] = useState('');

  const [scheduleItems, setScheduleItems ] = useState(
    [
      { week_day: 0, from: '', to: '' },
    ]
  )

  async function populeSubjects(){
    const subjectService = new SubjectsService()

    const parsedSubject = await subjectService.getSubjectsParsedAsItemView();

    setSubjectList(parsedSubject)
  }

  function HandleAddScheduleItem(){
    setScheduleItems(
      [
        ...scheduleItems,
        { week_day: 0, from: '', to: ''}
      ]
    )
  }

  function handleCreateClass(event: FormEvent){
    event.preventDefault();

    api.post('classes', {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost: Number(cost),
      schedule: scheduleItems
    }).then(() => {
      alert('Cadastro realizado com sucesso!')
      history.push('/')
    }).catch(() => {
      alert('Erro no cadastro')
    })
  }

  function handleUpdateScheduleItem(position: Number, field: string, value: string){
    const newArray = scheduleItems.map((scheduleItems, index) => {
      if(index === position){
        return {
          ...scheduleItems,
          [field]: value
        }
      }

      return scheduleItems
    })

    setScheduleItems(newArray);
  }

  useEffect(() => {
    populeSubjects();
  }, [])

  return (
    <div id="page-teacher-form" className="container">
      <PageHeader
        title="Que incrível que você quer dar aulas"
        description="O primeiro passo, é preencher esse formulário de inscrição"
      />

      <main>
        <form onSubmit={handleCreateClass}>
          <fieldset>
            <legend> Seus dados </legend>
            <Input
              name="name"
              label="Nome Completo"
              value={name}
              onChange={(e) => { setName(e.target.value) }}
            />

            <Input
              name="avatar"
              label="Avatar"
              value={avatar}
              onChange={(e) => { setAvatar(e.target.value) }}
            />

            <Input
              name="whatsapp"
              label="Whatsapp"
              value={whatsapp}
              onChange={(e) => { setWhatsapp(e.target.value) }}
            />

            <Textarea
              name="bio"
              label="Biografia"
              value={bio}
              onChange={(e) => { setBio(e.target.value) }}
            />

          </fieldset>

          <fieldset>
            <legend> Sobre a aula </legend>
            <Select
              name="subject"
              label="Matéria"
              options={subjectList}
              value={subject}
              onChange={(e) => { setSubject(e.target.value) }}
            />

            <Input
              name="cost"
              label="Custo da sua hora por aula"
              value={cost}
              onChange={(e) => { setCost(e.target.value) }}
            />
          </fieldset>

          <fieldset>
            <legend>
              Horários Disponíveis
              <button type="button" onClick={HandleAddScheduleItem}>
                + Novo horário
              </button>
            </legend>

            {scheduleItems.map((scheduleItem, index) => {
              return (
                <div key={index} className="schedule-item">
                  <Select
                    name="week_day"
                    label="Dia da semana"
                    value={scheduleItem.week_day}
                    onChange={e => handleUpdateScheduleItem(index, 'week_day', e.target.value)}
                    options={[
                      { value: '0', label: 'Domingo' },
                      { value: '1', label: 'Segunda-feira' },
                      { value: '2', label: 'Terça-feira' },
                      { value: '3', label: 'Quarta-feira' },
                      { value: '4', label: 'Quinta-feira' },
                      { value: '5', label: 'Sexta-feira' },
                      { value: '6', label: 'Sábado' },
                    ]}
                  />

                  <Input
                    name="from"
                    label="Das"
                    type="time"
                    value={scheduleItem.from}
                    onChange={e => handleUpdateScheduleItem(index, 'from', e.target.value)}
                  />
                  <Input
                    name="to"
                    label="Até"
                    type="time"
                    value={scheduleItem.to}
                    onChange={e => handleUpdateScheduleItem(index, 'to', e.target.value)}
                  />
                </div>
              )
            })}
          </fieldset>

          <footer>
            <p>
              <img src={warningIcon} alt="Aviso importante"/>
              Importante! <br/>

              Preencha todos os dados
            </p>

            <button type="submit"> Salvar cadastro </button>
          </footer>
        </form>
      </main>

    </div>
  );
};

export default TeacherForm;

import { useContext, useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiSettings, FiUpload } from 'react-icons/fi'
import avatar from '../../assets/avatar.png'
import { AuthContext } from '../../contexts/auth'
import './profile.css';
import { useTranslation } from 'react-i18next';
import { db, storage } from '../../services/firebaseConnection'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { toast } from 'react-toastify'


export default function Profile() {

  const { user, storageUser, setUser, logout } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
  const [imageAvatar, setImageAvatar] = useState(null);
  const [nome, setNome] = useState(user && user.nome)
  const [email, setEmail] = useState(user && user.email)


  const [loadingAuth, setLoadingAuth] = useState(false);
  const [clearingData, setClearingData] = useState(false);

  const { t } = useTranslation();

  function handleFile(e) {
    //setLoadingAuth(true)
    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        setImageAvatar(image)
        setAvatarUrl(URL.createObjectURL(image))
      } else {
        alert(t("Envie uma imagem do tipo PNG ou JPEG"));
        setLoadingAuth(false)
        setImageAvatar(null);
        return;
      }
    }
  }

  async function handleUpload() {
    setLoadingAuth(true)
    const currentUid = user.uid;
    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)
    const uploadTask = uploadBytes(uploadRef, imageAvatar)
      //Mandar e atualizar foto no banco de dados:
      .then((snapshop) => {
        getDownloadURL(snapshop.ref).then(async (downloadURL) => {
          let urlFoto = downloadURL;
          const docRef = doc(db, "users", user.uid)
          await updateDoc(docRef, {
            avatarUrl: urlFoto,
            nome: nome,
          })
            .then(() => {
              let data = {
                ...user,
                nome: nome,
                avatarUrl: urlFoto,
              }

              setUser(data);
              storageUser(data);
              toast.success(t("Atualizado com sucesso!"))
              setLoadingAuth(false)
            })
        })
      })
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoadingAuth(true)

    if (imageAvatar == null) {
      //Atualizar apenas o nome do user:
      const docRef = doc(db, "users", user.uid)
      await updateDoc(docRef, {
        nome: nome || null,
      })
        .then(() => {
          let data = {
            ...user,
            nome: nome || null,
          }

          setUser(data);
          storageUser(data);
          toast.success(t("Nome atualizado com sucesso!"))
          setLoadingAuth(false)
        })
    } else if (nome !== '' && imageAvatar !== null) {
      // Atualizar nome e foto:
      handleUpload()
    }
  }

  async function handleClear() {
    try {
      setClearingData(true);
      // Verifica se o usuário tem uma imagem para excluir
      console.log(avatarUrl)
      console.log(localStorage, '@ticketsPRO')
      if (!user.avatarUrl) {
        // Se não houver uma imagem, exiba uma mensagem para o usuário
        toast.info(t("Você não possui uma foto para remover."));
        setClearingData(false);
        return;
      }
      console.log(avatarUrl)
      // Define a referência para o arquivo de imagem no armazenamento do Firebase
      setClearingData(true);
      const imageRef = ref(storage, user.avatarUrl);

      // Exclui o arquivo de imagem
      await deleteObject(imageRef);
      console.log(imageRef)

      // Atualiza o URL da imagem para null no banco de dados
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        avatarUrl: null
      });
      console.log(avatarUrl)
      // Atualiza o estado do usuário e a URL do avatar
      setUser({ ...user, avatarUrl: null });
      setAvatarUrl(null);

      // ACESSAR '@ticketsPRO' e setar avatarUrl = null:
      // 1. Obter o objeto armazenado em localStorage com a chave '@ticketsPRO'
      const storedData = localStorage.getItem('@ticketsPRO');
      // 2. Converter a string JSON obtida em um objeto JavaScript
      const userData = JSON.parse(storedData);
      // 3. Modificar a propriedade 'avatarUrl' do objeto conforme necessário
      userData.avatarUrl = null; // ou qualquer outra modificação que você deseje fazer
      // 4. Converter o objeto modificado de volta para uma string JSON
      const updatedData = JSON.stringify(userData);
      // 5. Atualizar o valor armazenado em localStorage com a chave '@ticketsPRO'
      localStorage.setItem('@ticketsPRO', updatedData);
      console.log(localStorage, '@ticketsPRO')

      // Define clearingData como falso para indicar que a limpeza foi concluída
      console.log(avatarUrl)
      // Exibe uma mensagem de sucesso
      toast.success(t("Foto removida com sucesso!"));
      setClearingData(false);

    } catch (error) {
      console.error("Erro ao remover a foto:", error);
      // Exiba uma mensagem de erro
      toast.error(t("Erro ao remover a foto. Por favor, tente novamente."));
      // Define clearingData como falso para permitir que o usuário tente novamente
      setClearingData(false);
    }
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name={t("Minha conta")}>
          <FiSettings size={25} />
        </Title>

        <div className="container">

          <form className="form-profile" onSubmit={handleSubmit}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25} />
              </span>

              <input type="file" accept="image/*" id="avatar" name="avatar" onChange={handleFile} /> <br />
              {avatarUrl === null ? (
                <img src={avatar} alt="Foto de perfil" width={250} height={250} />
              ) : (
                <img src={avatarUrl} alt="Foto de perfil" width={250} height={250} />
              )}

              <input type="file" accept="image/*" id="avatar" name="avatar" onChange={handleFile} />
            </label>

            <label htmlFor="nome">{t('Nome')}</label>
            <input type="text" id="nome" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="off" />

            <label htmlFor="email" >Email</label>
            <input type="text" id="email" name="email" value={email} disabled={true} autoComplete="off" />

            <div className="button-container"> {/* Adiciona um contêiner para os botões */}
              <button className="up" type="submit">
                {loadingAuth ? t('Carregando...') : t('Salvar')}
              </button>

              <button className="cl" type="button" onClick={handleClear} disabled={clearingData || loadingAuth}>
                {clearingData ? t('Removendo...') : t('Remover foto')}
              </button>
            </div>
          </form>

        </div>

        <div className="container">
          <button className="logout-btn" onClick={() => logout()}>{t('Sair')}</button>
        </div>

      </div>

    </div>
  )
}
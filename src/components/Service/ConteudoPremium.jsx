const ConteudoPremium = () => {
    return ( 
        <form>
      <div className="textbox">
        <span className="material-symbols-outlined">Nome Completo</span>
        {/* <input type="text" placeholder="Nome Completo" value={fullName} onChange={(e) => setFullName(e.target.value)} /> */}
      </div>
      <div className="textbox">
        <span className="material-symbols-outlined">Senha</span>
        {/* <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} /> */}
      </div>
    </form>
  );
};
 
export default ConteudoPremium;
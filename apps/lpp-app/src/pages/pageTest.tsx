import Layout from '../component/Layout/Layout';   

export default function PageTest() {
   return (

         <div>
            {[...Array(100)].map((_, i) => (       
               <p key={i}>Ligne de test {i + 1}</p>
            ))}
         </div>

   );
}
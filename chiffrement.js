'use strict';

function modulo(a, b) {
    return (a % b + b) % b;
}

console.log("\n\x1B[0;32m____Le chiffre de César____\x1B[0;0m");
function cesar(text, offset) {
    return [...text].map(c=>cesar2(c, offset)).join(' ');
}

function cesar2(c, offset) {
    const in_ = c.charCodeAt(0);
    if (c >= 'A' && c <= 'Z') {
        const out_ = modulo(in_ - 'A'.charCodeAt(0) + offset, 26) + 'A'.charCodeAt(0);
        return String.fromCharCode(out_);
    } else if (c >= 'a' && c <= 'z') {
        const out_ = modulo(in_ - 'a'.charCodeAt(0) + offset, 26) + 'a'.charCodeAt(0);
        return String.fromCharCode(out_);
    } else {
        return c;
    }
}
const text = [..."coucou"];
let offset = 5
let message = "coucou"
console.log("Le mot "+message + " en strategie de César avec un décalage de "+ offset +" : ", cesar(text, offset));

console.log("\n\x1B[0;32m__Arithmétique modulaire__\x1B[0;0m");
console.log("\x1B[0;32m____Algorithme d'Euclide____\x1B[0;0m");
// arithmétique modulaire - algo d'euclide
function algo_eucl(a, b) {
    while (b !== 0) {
        const k = Math.floor(a/b);
        [a, b] = [b, a-k * b];
    }
    return a
}

// version recursive
function algo_eucl1(a, b) {
    if (b == 0) {
        return a
    } else {
        const k = Math.floor(a/b);
        return algo_eucl1(b, a-k * b) 
    }
}
let a1 = 5
let b1 = 3
console.log("euclide : algo_eucl("+a1+","+b1+") = ",algo_eucl(a1, b1))
console.log("euclide version récursive : algo_eucl1("+a1+","+b1+") = ",algo_eucl1(a1, b1))

console.log("\n\x1B[0;32m____Algorithme d'Euclide étendu____\x1B[0;0m");
// algo euclide etendu
function eucl_etendu(a, b) {
    let [c1,d1,g1,c2,d2,g2] = [Math.sign(a),0,Math.abs(a),0,Math.sign(b),Math.abs(b)];
    if(g1<g2){
        [c1,d1,g1,c2,d2,g2] = [c2,d2,g2,c1,d1,g1];
    }
    while(g2!==0){
        let k = Math.floor(g1/g2);
        [c1,d1,g1,c2,d2,g2] = [c2,d2,g2,c1-k*c2,d1-k*d2,g1-k*g2] ;
    }
    return [c1,d1,g1];
}
let a = 9;
let b = 13;
let euc_et = eucl_etendu(a, b)
console.log("eucl_etendu("+a+","+b+") = ", euc_et)
console.log(euc_et[0], "est inverse de", a, "modulo ", b)
console.log("\n\x1B[0;32m____Exponentiation modulaire____\x1B[0;0m");
// Exponentiation modulaire 9n**11n%17n = 15n
function expo_modulaire(x, exp, mod) {
    let xpemodm = 1;
    for (const d of exp.toString(2)) {
        xpemodm = xpemodm ** 2 % mod;
        if (d === '1') {
            xpemodm = xpemodm * x % mod;
        }
    }
    return xpemodm;
}

let x = 9;
let exp = 11;
let m = 17;
console.log("expo_modulaire("+x+","+exp+","+m+") = ",expo_modulaire(x, exp, m))

function expo_modulaire_BigInt(x, e, m) {
    x = BigInt(x);
    e = BigInt(e);
    m = BigInt(m);
    let xpemodm = 1n;
    for (const d of e.toString(2)) {
        xpemodm = xpemodm ** 2n % m;
        if (d === '1') {
            xpemodm = (xpemodm * x) % m;  // Utilisation des BigInts
        }
    }
    return xpemodm;
}

let xn = 9n;
let expn = 11n;
let modulon = 17n;
const result1 = expo_modulaire_BigInt(9n, 11n, 17n);
console.log("expo_modulaire_BigInt(",xn,", ",expn,", ",modulon,") = ", result1);

// RSA
// Fonctions pour obtenir un nombre premier compris entre min et max
function getPrimeNumber(min,max){
    let num = getNumber(min,max)
    while (!isPrime(num)){
        num = getNumber(min, max)
    }
    return num
}

function isPrime(num) {
    if (num == 2 || num == 3)
      return true;
    else if (num <= 1 || num % 2 == 0 || num % 3 == 0)
      return false;  
    for (let i = 5; i * i <= num ; i+=6) {
      if (num % i == 0 || num % (i + 2) == 0)
        return false;
    }
    return true;
}

// fonction pour obtenir un nombre aléatoire entre min et max
function getNumber(min,max){
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function chiffrement(publicKey,mess,pq){
    return expo_modulaire(mess,publicKey,pq)
}

function dechiffrement(privateKey,mess,pq){
    return expo_modulaire(mess,privateKey,pq)
}

function getKeys(){
    let p = getPrimeNumber(0,50)
    let q = getPrimeNumber(0,50)
    let pq = (p-1)*(q-1)
    let publicKey = getNumber(1,pq);
    let [privateKey,,g] = eucl_etendu(publicKey,pq);
    while (g!=1){
        publicKey = getNumber(1,pq);
        [privateKey,,g] = eucl_etendu(publicKey,pq);
    }
    privateKey = modulo((privateKey+pq),pq);
    return [publicKey, privateKey, p*q]
}

function algo_RSA(mess) {
    // Première étape : déterminer les clés (privé et publique)
    let [publicKey,privateKey,pq] = getKeys()
    // Deuxième étape : chiffrer le message à l'aide de la fonction d'exponentiation modulaire
    let messCrypted = chiffrement(publicKey,mess,pq)
    // Troisième étape : déchiffrer à  l'aide de la même fonction expo_modulaire(..)
    let messDecrypted = dechiffrement(privateKey,messCrypted,pq)
    // Sortie : les clés et les messages
    return [
        publicKey,
        privateKey,
        messCrypted,
        messDecrypted
    ]
}

const message1 = 10;
console.log("\n\x1B[0;32m____Algorithme RSA____\x1B[0;0m");
console.log("Message à chiffrer : ", message1)
// réception des données de l'algo RSA
let [publicKey, privateKey, messageCrypted, messageDecrypted] = algo_RSA(message1)
console.log("clé publique : ", publicKey, "clé privée : ", privateKey)
console.log("Message chiffré : ", messageCrypted)
console.log("Message déchiffré : ", messageDecrypted)

////////////////////////////////////////
// Polynôme de Lagrange
// polynome d'interpolaton de lagrange
/* version cours python
def evalPoly(poly, x):
    val = 0;
    for i in range(len(poly)):
        ai = poly[i]
        val += ai * x ** i
    return val

def evalPoly(poly, x):
    return sum([ai * x ** i for i, ai in enumerate(poly)])*/

console.log("\n\x1B[0;32m__Supplément : Interpolation polynômiale avec les polynômes de Lagrange__\x1B[0;0m");

function evalPoly(poly, x) {
    return poly.reduce((accumulator, ai, i) => accumulator + ai * Math.pow(x, i), 0);
}

// Multiplication de polynômes - séquence de multiplications Ruffini-Horner
// Exemple d'utilisation
const polyCoefficients = [1, 0, -1, 0, 0, 0.5];
const xValue = 1;
const result = evalPoly(polyCoefficients, xValue);

console.log("Pour le tableau de coefficients = ",polyCoefficients," et x = "+xValue+", P(x) = ",result);

function evalPoly1(poly, x) {
    let result = 0;
    let powerOfX = 1;

    for (let i = 0; i < poly.length; i++) {
        result += poly[i] * powerOfX;
        powerOfX *= x;
    }

    return result;
}

// Exemple d'utilisation
const polyCoefficients1 = [3, 0, 2, -1];
const xValue1 = 1;
const result2 = evalPoly1(polyCoefficients1, xValue1);

console.log("Méthode de Ruffini-Horner : Pour le tableau de coefficients = ", polyCoefficients1," et x = ", xValue1,", P(x) =", result2);

console.log("\n\x1B[0;32m____Multiplication de pôlynômes____\x1B[0;0m");
// Multiplication d'un polynôme par une constante
function multiplyPolyByConstant(poly, constant) {
    return poly.map(coeff => coeff * constant);
}

// Multiplication d'un polynôme par (x - x_j)
function multiplyPolyByLinearFactor(poly, xj) {
    const result = [];
    for (let i = 0; i < poly.length; i++) {
        result.push(poly[i] * -xj);
        if (i < poly.length - 1) {
            result[i + 1] = poly[i];
        }
    }
    return result;
}

// Addition de polynômes
function addPolynomials(poly1, poly2) {
    const result = [];
    const maxLength = Math.max(poly1.length, poly2.length);

    for (let i = 0; i < maxLength; i++) {
        const term1 = i < poly1.length ? poly1[i] : 0;
        const term2 = i < poly2.length ? poly2[i] : 0;
        result.push(term1 + term2);
    }

    return result;
}

// Exemple d'utilisation
const poly1 = [1, -0.5, 1, 0]; // Exemple de polynôme : 1 - 2x + 3x^2
const poly2 = [-2, 0, 0.5, -2];  // Exemple de polynôme : 1x + 2x^2

const constant = 2;
const xj = 3;

const result3 = multiplyPolyByConstant(poly1, constant);
const result4 = multiplyPolyByLinearFactor(poly1, xj);
const result5 = addPolynomials(poly1, poly2);

console.log("Multiplication par une constante :", poly1," * "+constant+" -> ",result3);
console.log("Multiplication par x :", poly1," -> ",result4);
console.log("Addition de polynômes :", poly1 ,"+",poly2," -> ",result5);

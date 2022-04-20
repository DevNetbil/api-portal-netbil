type HttpStatusCode = ''|'continue'|'switching_protocols'|'processing'|'ok'|'accepted'|'multi_status'|'moved_permanently'|'use_proxy'|'permanent_redirect'|'bad_request'|'unauthorized'|'not_found'|'internal_server_error'|'bad_gateway'|'insufficient_storage'

const sendStatus = (res:any, type: HttpStatusCode, message:string) => {
  switch (type) {
    case 'continue':
      res.status(100).send({ message });
      return;
    case 'switching_protocols':
      res.status(101).send({ message });
      return;
    case 'processing':
      res.status(102).send({ message });
      return;
    //
    case 'ok':
      res.status(200).send({ message });
      return;
    case 'accepted':
      res.status(202).send({ message });
      return;
    case 'multi_status':
      res.status(207).send({ message });
      return;
    //
    case 'moved_permanently':
      res.status(302).send({ message });
      return;
    case 'use_proxy':
      res.status(305).send({ message });
      return;
    case 'permanent_redirect':
      res.status(308).send({ message });
      return;
    //
    case 'bad_request':
      res.status(400).send({ message });
      return;
    case 'unauthorized':
      res.status(401).send({ message });
      return;
    case 'not_found':
      res.status(404).send({ message });
      return;
    //
    case 'internal_server_error':
      res.status(500).send({ message });
      return;
    case 'bad_gateway':
      res.status(502).send({ message });
      return;
    case 'insufficient_storage':
      res.status(507).send({ message });
      return;
    //
    case '':
      res.status(500).send({ message });
      return;
    default:
      res.status(500).send({ message: 'Internal server error.' });
  }
};

export default sendStatus;

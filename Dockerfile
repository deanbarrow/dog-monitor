FROM node:latest

ADD https://api.github.com/repos/deanbarrow/dog-monitor/git/refs/heads/master version.json

RUN git clone https://github.com/deanbarrow/dog-monitor /dog

WORKDIR /dog

RUN cd /dog && npm install

RUN mkdir /dog/data

VOLUME /dog/data

EXPOSE 3000

CMD ["npm", "start"]
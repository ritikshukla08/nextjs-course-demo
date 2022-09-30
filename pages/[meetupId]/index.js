import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

import MeetUpDetail from "../../components/meetups/MeetUpDetail";

const MeetUpDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetUpData.title}</title>
        <meta name="description" content={props.meetUpData.description} />
      </Head>
      <MeetUpDetail
        image={props.meetUpData.image}
        title={props.meetUpData.title}
        address={props.meetUpData.address}
        description={props.meetUpData.description}
      />
    </Fragment>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://ritik0802:Rukqbr9oz2BEfhbS@cluster0.rrkieuu.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 0 }).toArray();
  client.close();

  return {
    fallback: true,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://ritik0802:Rukqbr9oz2BEfhbS@cluster0.rrkieuu.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetUpData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
        address: selectedMeetup.address,
      },
    },
  };
}

export default MeetUpDetails;
